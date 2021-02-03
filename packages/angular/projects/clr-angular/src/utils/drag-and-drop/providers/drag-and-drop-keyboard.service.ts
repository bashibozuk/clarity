import { Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { ClrDraggable } from '../draggable/draggable';

@Injectable()
export class DragAndDropKeyboardService implements OnDestroy {
  keydownListener: () => void = () => {};

  constructor(private renderer: Renderer2) {}

  public listen(element: HTMLElement) {
    this.keydownListener = this.renderer.listen(element, 'keydown', (event: KeyboardEvent) => {});
  }

  public ngOnDestroy() {
    this.keydownListener();
  }
}
