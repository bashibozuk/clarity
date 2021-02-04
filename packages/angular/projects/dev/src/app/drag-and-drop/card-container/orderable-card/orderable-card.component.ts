// Copyright 2019 VMware, Inc. All rights reserved. -- VMware Confidential

import { Component, ViewChild, TemplateRef, EmbeddedViewRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ClrCardContainerService } from '../card-container.service';
import { ArrowKeyDirection } from '../card-container.interface';
import { ClrDroppable } from '@clr/angular';

@Component({
  selector: 'clr-orderable-card',
  templateUrl: './orderable-card.component.html',
  styleUrls: ['./orderable-card.component.scss'],
})
export class ClrCardContainerCard implements OnInit {
  @ViewChild('clrOrderableCard', { static: true }) clrOrderableCard: TemplateRef<any>;
  @ViewChild(ClrDroppable) clrDroppable: ClrDroppable<any>;

  /**
   * id of the card
   * Usages id provided in the CardInfo (@see #CardInfo).
   * @Optional() If provided used to persist card info
   */
  @Input()
  cardId: string;

  /**
   * Order of the card
   * Usages order provided in the CardInfo (@see #CardInfo).
   * @Optional()
   * Default: As per cards added in DOM
   */
  _order: number | undefined;
  @Input()
  set order(val: number | undefined) {
    this._order = val;
    this.orderChange.emit(val);
  }

  get order() {
    return this._order;
  }

  @Output()
  orderChange: EventEmitter<number> = new EventEmitter<number>(true);

  /**
   * To show/hide card
   * Usages id provided in the CardInfo (@see #CardInfo).
   * @Optional() If provided true used to hide card
   */
  @Input()
  hidden: boolean | undefined;

  view: EmbeddedViewRef<void>;

  arrowKeyDirection = ArrowKeyDirection;

  constructor(public clrCardContainerService: ClrCardContainerService) {}

  ngOnInit() {
    this.view = this.clrOrderableCard?.createEmbeddedView(null);
  }

  // TODO: Remove this once its gets fixed in Clarity
  public onDragMove() {
    // Hack to make droppable over work
    // if (this.clrDroppable['clientRect']) {
    //    delete this.clrDroppable['clientRect'];
    // }
  }
}
