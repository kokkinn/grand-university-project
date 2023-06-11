import { PriorityQueue } from "./priorityQueue.js";

class DefaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
                typeof defaultInit === "function"
                  ? new defaultInit().valueOf()
                  : defaultInit),
      }
    );
  }
}

class Node {
  frequency;
  value;
  binCode;
  leftChild;
  rightChild;

  constructor(frequency_, value_, leftChild_ = null, rightChild_ = null) {
    this.frequency = frequency_;
    this.value = value_;
    this.leftChild = leftChild_;
    this.rightChild = rightChild_;
  }

  assignCode(code, codesToValuesMap) {
    this.binCode = code;
    if (this.leftChild !== null && this.rightChild !== null) {
      this.leftChild.assignCode(code + "0", codesToValuesMap);
      this.rightChild.assignCode(code + "1", codesToValuesMap);
    } else {
      codesToValuesMap[this.value] = this.binCode;
    }
  }
}

class HuffmanTreeEncoding {
  frequencyMap = new DefaultDict(0);
  priorityQueue1 = new PriorityQueue();
  binaryTree;
  inputString;
  encodedString = "";
  codesToValuesMap = {};
  constructor(inputString_) {
    this.inputString = inputString_;
  }

  generateFrequencyMap() {
    for (const ch in this.inputString) {
      this.frequencyMap[this.inputString[ch]] += 1;
    }
    return this.frequencyMap;
  }

  generatePriorityQueue() {
    for (const key in this.frequencyMap) {
      this.priorityQueue1.add(new Node(this.frequencyMap[key], key));
    }
    return this.priorityQueue1;
  }

  generateTree() {
    this.binaryTree = this.priorityQueue1;
    while (this.binaryTree.length() > 1) {
      const nlc = this.binaryTree.remove();
      const nrc = this.binaryTree.remove();
      this.binaryTree.add(
        new Node(nlc.frequency + nrc.frequency, "", nlc, nrc)
      );
    }
    this.binaryTree = this.binaryTree.remove();
    this.binaryTree.assignCode("", this.codesToValuesMap);
    return this.binaryTree;
  }

  encodeInputString() {
    for (const ch in this.inputString) {
      this.encodedString += this.codesToValuesMap[this.inputString[ch]];
    }
    return this.encodedString;
  }

  decodeEncodedString() {
    let decodedString = "";
    let tempTree = this.binaryTree;
    for (const ch in this.encodedString) {
      if (this.encodedString[ch] === "1") {
        tempTree = tempTree.rightChild;
      } else if (this.encodedString[ch] === "0") {
        tempTree = tempTree.leftChild;
      }
      if (tempTree.leftChild == null && tempTree.rightChild == null) {
        decodedString += tempTree.value;
        tempTree = this.binaryTree;
      }
    }
    return decodedString;
  }

  treeToDict(node = this.binaryTree) {
    if (node.leftChild !== null && node.rightChild !== null) {
      return {
        binCode: node.binCode,
        frequency: node.frequency,
        value: node.value,
        children: [
          this.treeToDict(node.leftChild),
          this.treeToDict(node.rightChild),
        ],
      };
    } else {
      return {
        binCode: node.binCode,
        frequency: node.frequency,
        value: node.value,
      };
    }
  }
}

const hte1 = new HuffmanTreeEncoding("a");
hte1.generateFrequencyMap();
hte1.generatePriorityQueue();
console.log(hte1.generateTree());
hte1.encodeInputString();
hte1.treeToDict();

export { HuffmanTreeEncoding };
