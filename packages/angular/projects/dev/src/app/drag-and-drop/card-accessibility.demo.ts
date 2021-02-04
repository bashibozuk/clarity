import { Component } from '@angular/core';
import { ClrDragEvent } from '@clr/angular';
import { AsyncInfiniteTree } from '../tree-view/utils/async-infinite-tree';
import { InfiniteTree } from '../tree-view/utils/infinite-tree';
import { DndTree, DndTreeFixture, DndTreeNode } from './dnd-tree';

@Component({
  selector: 'drag-and-drop-card-accessibility-demo',
  templateUrl: './card-accessibility.demo.html',
  styles: [
    `
      p {
        font-family: Lato;
      }

      .card {
        width: 200px;
      }

      .card-block {
        height: 150px;
      }

      /* .scrollable-container {
        padding: 80px 0;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: auto;
    } */
    `,
  ],
})
export class CardAccessibilityDemo {}
