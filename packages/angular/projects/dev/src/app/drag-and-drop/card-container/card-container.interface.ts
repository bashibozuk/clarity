// Copyright 2019 VMware, Inc. All rights reserved. -- VMware Confidential

/**
 * CardContainerInfo to keep state of the card container
 */
export interface CardContainerInfo {
  /**
   *  id of the Card Container
   */
  containerId?: string;
}

/**
 * CardInfo to keep state of the card
 */
export interface CardInfo {
  /**
   *  id of the Card
   */
  cardId?: string;
  /**
   *  Order of the card, if not specified usages normal index order
   */
  order?: number;
  /**
   *  Specifies whether this card is hidden.
   */
  hidden?: boolean;
}

/**
 * ArrowKey direction
 */
export enum ArrowKeyDirection {
  LEFT,
  RIGHT,
}
