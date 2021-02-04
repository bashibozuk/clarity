// Copyright 2019 VMware, Inc. All rights reserved. -- VMware Confidential

import {
  Component,
  ContentChildren,
  QueryList,
  ViewChild,
  ViewContainerRef,
  AfterContentInit,
  Input,
} from '@angular/core';
import { ClrCardContainerService } from './card-container.service';
import { ClrCardContainerCard } from './orderable-card/orderable-card.component';

@Component({
  selector: 'clr-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss'],
  providers: [ClrCardContainerService],
})
export class ClrCardContainer implements AfterContentInit {
  @ViewChild('clrCardContainer', { read: ViewContainerRef, static: true }) clrCardContainer: ViewContainerRef;
  @ContentChildren(ClrCardContainerCard) clrCardContainerCards: QueryList<ClrCardContainerCard>;

  constructor(private clrCardContainerService: ClrCardContainerService) {}

  ngAfterContentInit() {
    // initialize card container service
    this.clrCardContainerService.initialize(this.clrCardContainer, this.clrCardContainerCards);
  }
}
