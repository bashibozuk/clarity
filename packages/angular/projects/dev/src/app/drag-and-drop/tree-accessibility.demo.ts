import { Component } from '@angular/core';
import { ClrDragEvent } from '@clr/angular';
import { AsyncInfiniteTree } from '../tree-view/utils/async-infinite-tree';
import { InfiniteTree } from '../tree-view/utils/infinite-tree';
import { DndTree, DndTreeFixture, DndTreeNode } from './dnd-tree';

@Component({
  selector: 'drag-and-drop-tree-accessibility-demo',
  templateUrl: './tree-accessibility.demo.html',
  styles: [
    `
      .node-item-wrapper {
        flex-grow: 1;
        padding-left: 1.5rem;
        margin-left: -1.5rem;
      }
    `,
  ],
})
export class TreeAccessibilityDemo {
  tree = new DndTree(DndTreeFixture);

  getChildren = (node: DndTreeNode) => this.tree.getChildren(node);

  constructor() {}

  onDrop(event: ClrDragEvent<DndTreeNode>, parent: DndTreeNode) {
    const node = event.dragDataTransfer;
    if (parent === node.parent) {
      return;
    }
    this.tree.add(node, parent);
    this.tree.root = this.tree.root.slice();
  }

  onTreeFocusChanged(value: any) {
    console.log(value);
  }
}
