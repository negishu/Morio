class CollisionDetector {
  detectCollision(actor1, actor2) {
    return this.detectRectangleCollision(actor1, actor2);
  }
  detectRectangleCollision(actor1, actor2) {
    const horizontal = (actor2.x+1 < actor1.x + actor1.w) && (actor1.x+1 < actor2.x + actor2.w);
    const vertical   = (actor2.y+1 < actor1.y + actor1.h) && (actor1.y+1 < actor2.y + actor2.h);
    return (horizontal && vertical);
  }
}

class CollisionFinder {
  constructor(width, height, level) {
    this._width = width;
    this._height = height;
    this._currentLevel = 0;
    this.data = [null];
    while(this._currentLevel < level) {
      this._expand();
    }
    this._detector = new CollisionDetector();
  }
  clear() {
    this.data.fill(null);
  }
  _addNode(node, level, index) {
    const offset = ((4 ** level) - 1) / 3;
    const linearIndex = offset + index;
    while(this.data.length <= linearIndex) {
      this._expandData();
    }
    let parentCellIndex = linearIndex;
    while(this.data[parentCellIndex] === null) {
      this.data[parentCellIndex] = [];
      parentCellIndex = Math.floor((parentCellIndex - 1) / 4);
      if(parentCellIndex >= this.data.length) {
        break;
      }
    }
    const cell = this.data[linearIndex];
    cell.push(node);
  }
  addActor(actor) {
    const leftTopMorton = this._calc2DMortonNumber(actor.left, actor.top);
    const rightBottomMorton = this._calc2DMortonNumber(actor.right, actor.bottom);
    if(leftTopMorton === -1 && rightBottomMorton === -1) {
      this._addNode(actor, 0, 0);
      return;
    }
    if(leftTopMorton === rightBottomMorton) {
      this._addNode(actor, this._currentLevel, leftTopMorton);
      return;
    }
    const level = this._calcLevel(leftTopMorton, rightBottomMorton);
    const larger = Math.max(leftTopMorton, rightBottomMorton);
    const cellNumber = this._calcCell(larger, level);
    this._addNode(actor, level, cellNumber);
  }
  _expand() {
    const nextLevel = this._currentLevel + 1;
    const length = ((4 ** (nextLevel+1)) - 1) / 3;
    while(this.data.length < length) {
      this.data.push(null);
    }
    this._currentLevel++;
  }
  _separateBit32(n) {
    n = (n|(n<<8)) & 0x00ff00ff;
    n = (n|(n<<4)) & 0x0f0f0f0f;
    n = (n|(n<<2)) & 0x33333333;
    return (n|(n<<1)) & 0x55555555;
  }
  _calc2DMortonNumber(x, y) {
    if(x < 0 || y < 0 || x > this._width || y > this._height) {
      return -1;
    }
    const xCell = Math.floor(x / (this._width  / (2 ** this._currentLevel)));
    const yCell = Math.floor(y / (this._height / (2 ** this._currentLevel)));
    return (this._separateBit32(xCell) | (this._separateBit32(yCell)<<1));
  }
  _calcLevel(leftTopMorton, rightBottomMorton) {
    const xorMorton = leftTopMorton ^ rightBottomMorton;
    let level = this._currentLevel - 1;
    let attachedLevel = this._currentLevel;
    for(let i = 0; level >= 0; i++) {
      const flag = (xorMorton >> (i * 2)) & 0x3;
      if(flag > 0) {
        attachedLevel = level;
      }
      level--;
    }
    return attachedLevel;
  }
  _calcCell(morton, level) {
    const shift = ((this._currentLevel - level) * 2);
    return morton >> shift;
  }

  hitTest(currentIndex = 0, objList = []) {
    const currentCell = this.data[currentIndex];
    this.hitTestInCell(currentCell, objList);
    let hasChildren = false;
    for(let i = 0; i < 4; i++) {
      const nextIndex = (currentIndex === 0) ? i + 1 : currentIndex * 4 + i;
      const hasChildCell = (nextIndex < this.data.length) && (this.data[nextIndex] !== null);
      hasChildren = hasChildren || hasChildCell;
      if(hasChildCell) {
        objList.push(...currentCell);
        this.hitTest(nextIndex, objList);
      }
    }
    if(hasChildren) {
      const popNum = currentCell.length;
      for(let i = 0; i < popNum; i++) {
        objList.pop();
      }
    }
  }

  hitTestInCell(cell, objList) {
    const length = cell.length;
    for(let i=0; i < length - 1; i++) {
      const obj1 = cell[i];
      for(let j=i+1; j < length; j++) {
        const obj2 = cell[j];
        const hit = this._detector.detectCollision(obj1, obj2);
        if(hit) {
          obj1.hit(obj2);
          obj2.hit(obj1);
        }
      }
    }
    const objLength = objList.length;
    const cellLength = cell.length;
    for(let i=0; i<objLength; i++) {
      const obj1 = objList[i];
      for(let j=0; j<cellLength; j++) {
        const obj2 = cell[j];
        const hit = this._detector.detectCollision(obj1, obj2);
        if(hit) {
          obj1.hit(obj2);
          obj2.hit(obj1);
        }
      }
    }
  }
}
