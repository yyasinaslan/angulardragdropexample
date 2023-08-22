import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';

function moveItemInArray(array: Array<any>, prevIndex: number, currentIndex: number) {
  while (prevIndex < 0) prevIndex += array.length;
  while (currentIndex < 0) currentIndex += array.length;
  if (currentIndex >= array.length) {
    let k = currentIndex - array.length + 1;
    while (k--) array.push(undefined);
  }
  array.splice(currentIndex, 0, array.splice(prevIndex, 1)[0]);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  dropListClass = 'dropList';
  dragItemClass = 'dragItem';
  isDragging = false;
  source?: HTMLElement;
  sourceIndex?: number;
  target?: HTMLElement;
  targetIndex?: number;
  dragItemHandle?: HTMLElement;
  originalOpacity = '1';

  debug1 = false;

  @ViewChild('container') container!: ElementRef;
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  private sourceItem?: any;

  @HostListener('window:mouseup', ['$event']) mouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.dragItemHandle?.remove();
    if (this.source)
      this.source.style.opacity = this.originalOpacity;
    console.log(event)

    if (this.sourceIndex === undefined ||
      this.sourceIndex < 0 ||
      this.targetIndex === undefined ||
      this.targetIndex < 0)
      return;

    moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
  }

  @HostListener('window:mousemove', ['$event']) mouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const target = event.target as HTMLElement;

    this.target = this.isDrag(target) ?? undefined;
    this.targetIndex = this.target ? this.getIndexOfItem(this.target) : -1;

    this.debug1 = !!this.target;

    if (this.dragItemHandle) {
      this.moveDragItemHandle(event)
    }

    if (!this.target || this.target == this.source) return;

    this.moveSource(this.targetIndex);


  }

  ngAfterViewInit(): void {
    // const container = this.container.nativeElement as HTMLElement;
    // const dragItems = container.children;
  }


  mouseDown(event: MouseEvent, itemRef: HTMLElement, item: any) {
    this.sourceItem = item;
    this.originalOpacity = itemRef.computedStyleMap().get('opacity') as string;
    this.isDragging = true;
    this.source = itemRef;
    this.sourceIndex = this.getIndexOfItem(itemRef);

    const rect = itemRef.getBoundingClientRect();
    const offsetX = event.clientX - rect.x;
    const offsetY = event.clientY - rect.y;


    this.dragItemHandle = this.source.cloneNode(true) as HTMLElement;
    this.dragItemHandle.classList.add('dragItemHandle')
    this.dragItemHandle.style.top = `${event.clientY}px`;
    this.dragItemHandle.style.left = `${event.clientX}px`;
    this.dragItemHandle.style.translate = `${-offsetX}px ${-offsetY}px`;
    this.container.nativeElement.appendChild(this.dragItemHandle);
    itemRef.style.opacity = '0.5';

  }

  /**
   * Check if element is part of a dragItem or not
   * @param element
   * @param scope
   */
  isDrag(element: HTMLElement, scope?: HTMLElement): HTMLElement | null {
    if (!scope) scope = this.container.nativeElement;

    if (!scope!.contains(element)) return null;

    if (element.classList.contains(this.dragItemClass)) return element;

    let parent = element.parentElement;
    while (parent && !parent.classList.contains(this.dropListClass) && !parent.classList.contains(this.dragItemClass)) {
      parent = parent.parentElement;
    }

    if (!parent) return null;

    // It means we are in a dragItem
    if (parent.classList.contains(this.dragItemClass)) return parent;

    return null;
  }

  private moveDragItemHandle(event: MouseEvent) {
    const handle = this.dragItemHandle!;
    const x = event.pageX;
    const y = event.pageY;
    handle.style.top = `${y}px`;
    handle.style.left = `${x}px`;
  }

  private getIndexOfItem(item: HTMLElement) {
    const container = this.container.nativeElement as HTMLElement;
    let index = -1;
    for (let i = 0; i < container.children.length; i++) {
      if (item == container.children[i]) {
        index = i;
        break;
      }
    }
    return index;
  }

  private moveSource(index: number) {
    if (!this.source) return;
    const container = this.container.nativeElement as HTMLElement;

    container.removeChild(this.source);
    container.insertBefore(this.source, container.childNodes[index]);
  }
}
