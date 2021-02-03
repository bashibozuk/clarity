export interface DndTreeNode {
  parent: DndTreeNode;
  children: DndTreeNode[];
  label: string;
  expanded: boolean;
}

export class DndTree {
  constructor(public root: DndTreeNode[]) {}

  getChildren(node: DndTreeNode): DndTreeNode[] {
    return node.children;
  }

  add(node: DndTreeNode, parent: DndTreeNode): void {
    if (node === parent || node.parent === parent) {
      return;
    }
    // remove(node)
    this.remove(node, this.root);
    // add
    node.parent = parent;
    parent.children.push(node);
  }

  remove(node: DndTreeNode, root: DndTreeNode[]) {
    for (let i = 0; i < root.length; i++) {
      if (root[i] === node) {
        root.splice(i, 1);
        return;
      }
      if (root[i].children.length) {
        this.remove(node, root[i].children);
      }
    }
  }
}
const r1 = {
  parent: null,
  label: '1',
  children: [],
  expanded: false,
};
const r11 = {
  parent: r1,
  label: '1.1',
  children: [
    {
      parent: this,
      label: '1.1.1',
      children: [],
      expanded: false,
    },
  ],
};
const r12 = {
  parent: r1,
  label: '1.2',
  children: [],
  expanded: false,
};
r12.children = [
  {
    parent: r12,
    label: '1.2.1',
    children: [],
    expanded: false,
  },
];
r1.children = [r11, r12];

const r2 = {
  parent: null,
  label: '2',
  children: [],
  expanded: false,
};
const r21 = {
  parent: r2,
  label: '2.1',
  children: [],
  expanded: false,
};
r21.children = [
  {
    parent: r21,
    label: '2.1.1',
    children: [],
    expanded: false,
  },
];
const r22 = {
  parent: r2,
  label: '2.2',
  children: [],
  expanded: false,
};
r22.children = [
  {
    parent: r22,
    label: '2.2.1',
    children: [],
    expanded: false,
  },
];
r2.children = [r21, r22];
const root = [r1, r2];
export const DndTreeFixture: DndTreeNode[] = root;
