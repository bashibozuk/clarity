// Copyright 2019 VMware, Inc. All rights reserved. -- VMware Confidential

import { QueryList, ViewContainerRef, Injectable, EmbeddedViewRef } from '@angular/core';
import { ArrowKeyDirection, CardInfo } from './card-container.interface';
import { ClrCardContainerCard } from './orderable-card/orderable-card.component';
import { Observable } from 'rxjs';
import { ClrDragEvent } from '@clr/angular';

const SCROLL_SPEED = 5;
const SCROLL_THRESHOLD = 10;

@Injectable()
export class ClrCardContainerService {
  private cardContainer: ViewContainerRef;
  private cardContainerCards: QueryList<ClrCardContainerCard>;
  private orderedCards: ClrCardContainerCard[];
  private dragOrder: number;
  private containerId: string;
  private cardsInfo: CardInfo[];

  private a11yMode: boolean;
  private a11yDragOrder: number = -1;
  private a11yDropOrder: number = -1;

  constructor() {}

  /**
   * initialize card container service by passing
   * references to ViewContainerRef and QueryList of the cards
   */
  public initialize(cardContainer: ViewContainerRef, cardContainerCards: QueryList<any>) {
    this.cardContainer = cardContainer;
    this.cardContainerCards = cardContainerCards;
    this.arrangeAndInsertCards();
  }

  /**
   * arranges cards according to the the order
   * remove any hidden cards and inserts them into the view container
   */
  private arrangeAndInsertCards() {
    // get updated cards with order and hidden info
    this.orderedCards = this.addCardInfo();

    // hide hidden cards
    this.orderedCards = this.orderedCards.filter((card: ClrCardContainerCard) => card.hidden !== true);

    // sort cards according to order
    this.arrangeCardsByOrder(this.orderedCards);

    // insert sorted cards into the container
    this.insertCards(this.orderedCards);
  }

  /**
   * Update the card info for the card
   */
  private addCardInfo(): ClrCardContainerCard[] {
    return this.cardContainerCards.map((card: ClrCardContainerCard, idx: number) => {
      const cardInfo: CardInfo =
        this.cardsInfo && this.cardsInfo.filter((info: CardInfo) => info.cardId === card.cardId)[0];

      // if no oder is specified user the order in which cards are added in dom
      if (card.order === undefined) {
        card.order = cardInfo && cardInfo.order !== undefined ? cardInfo.order : idx;
      }

      // if no hidden attribute is specified
      if (card.hidden === undefined) {
        card.hidden = cardInfo && cardInfo.hidden !== undefined ? cardInfo.hidden : false;
      }

      return card;
    });
  }

  /**
   * Sorts cards in ascending order of the card
   */
  private arrangeCardsByOrder(orderedCards: ClrCardContainerCard[]) {
    orderedCards.sort((a: any, b: any): number => {
      return a.order - b.order;
    });
  }

  /**
   * Insert Cards into the view
   */
  private insertCards(orderedCards: ClrCardContainerCard[]) {
    orderedCards.forEach((card: ClrCardContainerCard, idx: number) => {
      // update order to remove duplicates
      // [0,1,1,2] -> [0,1,2,3]
      card.order = idx;
      this.cardContainer.insert(card.view);
    });
  }

  /**
   * Saves the order of drag order to plate at the drop order later
   */
  public onDragStart(dragOrder: number) {
    this.dragOrder = dragOrder;

    // if previously in a11y mode, clear it
    if (this.a11yMode) {
      this.getOutOfA11yMode();
    }
  }

  /**
   * On drop move the cards from drag order to drop order
   */
  public onDragDrop(dropOrder: number) {
    this.moveCard(this.dragOrder, dropOrder);
  }

  /**
   * On Enter Key
   * If its first enter on the card container - updates the drag order
   * Else moves the card from drag order to drop order
   */
  public onKeyEnter(event: KeyboardEvent, cardOrder: number) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.a11yMode) {
      this.moveCard(this.a11yDragOrder, this.a11yDropOrder);
      this.getOutOfA11yMode();
    } else {
      this.a11yDragOrder = cardOrder;
      this.a11yMode = true;
    }
  }

  /**
   * On Esc Key
   * get out the a11y mode
   */
  public onKeyEsc(event: KeyboardEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.a11yMode) {
      this.getOutOfA11yMode();
    }
  }

  /**
   * On Arrow Keys
   * Updates the drop placeholder according to the arrow key direction
   */
  public onArrowKeys(event: KeyboardEvent, arrowKeyDirection: number) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.a11yMode) {
      if (this.a11yDropOrder === -1) {
        this.a11yDropOrder = arrowKeyDirection === ArrowKeyDirection.LEFT ? this.orderedCards.length - 1 : 0;
      } else {
        this.a11yDropOrder =
          arrowKeyDirection === ArrowKeyDirection.LEFT ? this.a11yDropOrder - 1 : this.a11yDropOrder + 1;
        if (this.a11yDropOrder < 0) {
          this.a11yDropOrder = this.orderedCards.length - 1;
        }
        if (this.a11yDropOrder > this.orderedCards.length - 1) {
          this.a11yDropOrder = 0;
        }
      }

      //TODO: fetch this element from events once available in next version of Clarity
      const dropPlaceholderCard = this.cardContainerCards.filter(
        (card: ClrCardContainerCard) => card.order === this.a11yDropOrder
      )[0];
      const droppableEl = dropPlaceholderCard.clrDroppable['droppableEl'];
      droppableEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Autoscroll into view if needed
   */
  public onDragMove(event: ClrDragEvent<any>) {
    const scrollableParent: HTMLElement | null = this.findFirstScrollableParent(
      this.cardContainer.element.nativeElement
    );

    if (scrollableParent) {
      //TODO: fetch this element from events once available in next version of Clarity
      const ghostEl: HTMLElement | null = scrollableParent.querySelector('clr-draggable-ghost') as HTMLElement;

      if (ghostEl) {
        const scrollableParentRect: ClientRect = scrollableParent.getBoundingClientRect();
        const ghostEltRect: ClientRect = ghostEl.getBoundingClientRect();

        if (scrollableParent.offsetHeight + scrollableParentRect.top - ghostEltRect.bottom < SCROLL_THRESHOLD) {
          scrollableParent.scrollTop += SCROLL_SPEED; // scroll down if draggable ghost bottom goes below scrolling window
        } else if (ghostEltRect.top - scrollableParentRect.top < SCROLL_THRESHOLD) {
          scrollableParent.scrollTop -= SCROLL_SPEED; // scroll up if draggable ghost top goes above scrolling window
        }
      }
    }
  }

  /**
   * checks if cardOrder is equal to a11yDragOrder
   */
  public isSelectedCard(cardOrder: number): boolean {
    return this.a11yDragOrder === cardOrder;
  }

  /**
   * checks if cardOrder is equal to a11yDropOrder
   */
  public isDraggableOver(order: number): boolean {
    return this.a11yDropOrder === order;
  }

  /**
   * Get out of the Accessibility mode
   */
  private getOutOfA11yMode() {
    this.a11yMode = false;
    this.a11yDropOrder = -1;
    this.a11yDragOrder = -1;
  }

  /**
   * Moves the card from Drag Index to Drop Index
   * by detaching card from view at drag Index and inserting it into Drop Index
   *
   * Updates the order of the remaining cards once done
   */
  private moveCard(fromIndex: number, toIndex: number) {
    const dragView = this.cardContainer.get(fromIndex) as EmbeddedViewRef<void>;
    if (dragView) {
      this.cardContainer.move(dragView, toIndex);
    }

    // update the order on the cards
    this.updateCardInfo();
  }

  /**
   * Updates the order of the remaining cards as per view
   */
  private updateCardInfo() {
    this.cardsInfo = [];

    this.orderedCards.forEach((card: any) => {
      if (card.order !== this.cardContainer.indexOf(card.view)) {
        card.order = this.cardContainer.indexOf(card.view);
      }
      const cardInfo: CardInfo = {
        cardId: card.cardId,
        order: card.order,
        hidden: card.hidden,
      };
      this.cardsInfo.push(cardInfo);
    });
  }

  /**
   * Finds first scrollable parent of element
   */
  private findFirstScrollableParent(el: HTMLElement | null): HTMLElement | null {
    if (el === null) {
      return null;
    }

    if (el.parentElement === null) {
      return null;
    }

    if (this.isScrollable(el.parentElement)) {
      return el.parentElement;
    }

    if (el.parentElement === document.body) {
      return null;
    }

    return this.findFirstScrollableParent(el.parentElement);
  }

  /**
   * Check if element is scrollable
   */
  private isScrollable(el: HTMLElement | null): boolean {
    if (el === null) {
      return false;
    }

    if (el.clientHeight >= el.scrollHeight) {
      return false;
    }
    const styleDeclaration: CSSStyleDeclaration = getComputedStyle(el);
    return styleDeclaration.overflowY === 'auto' || styleDeclaration.overflowY === 'scroll';
  }
}
