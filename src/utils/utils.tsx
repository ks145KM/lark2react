import { BLOCK_TYPE_TO_COMPONENT } from "./blockTypeMapping";

//block_idと、block_idに対応したデータのハッシュ表
export function genHashBlockId(items): Record<string, any> {
  const hash: Record<string, any> = {};

  items.forEach((block) => {
    hash[block.block_id] = block;
  });

  return hash;
}

//今のところこれ必要ないかも
function buildTree(items) {
  const hashTable = genHashBlockId(items);
  const Tree: Record<string, string[]> = {};

  items.forEach((item) => {
    if (item.children) {
      Tree[item.block_id] = item.children;
    } else {
      Tree[item.block_id] = [];
    }
  });

  return Tree;
}

//block_idから対応したfunction componentを取得
//e.g. "Lqzudvi1DokvIqxBn2rj94udpob" -> Page()
export function id2Component(blockIdArr, hash) {
  if (blockIdArr.length > 1) {
    const arr = [];
    for (let i = 0; i < blockIdArr.length; i++) {
      const blockData = hash[blockIdArr[i]];
      arr.push(blockData);
    }

    const blockType = arr[0].block_type;
    const Component = BLOCK_TYPE_TO_COMPONENT[blockType];
    //orderlistに限り、blockDataの配列を渡す
 
    return <Component blockDataArr={arr} hash={hash} />;
  } else {
    const blockData = hash[blockIdArr[0]];
    const blockType = blockData.block_type;
    const Component = BLOCK_TYPE_TO_COMPONENT[blockType];
    return <Component blockData={blockData} hash={hash} />;
  }
}

//親が持つ子要素をコンポーネントとして表示する
export function displayChildComponent(blockData, hash) {
  if (blockData.children) {
    const blockDataArr = groupingblockData(blockData, hash);

    return (
      <div>
        {blockDataArr.map((childIdArr, index) => (
          <div key={index}>{id2Component(childIdArr, hash)}</div>
        ))}
      </div>
    );
  }
}

// 同じblockTypeが連続している場合、グループ化をする関数
// 1Data は blockTypeが1のdataBlock
// blockDataArr[[13Dataのid, 13Dataのid], [1Dataのid], [5Dataのid], [13Dataのid]]
// 番号付きリストを連番で表示するのに今のところ使用
function groupingblockData(blockData, hash) {
  const orderdListBlockType = 13;
  const blockDataArr: string[][] = [];
  let currentGroup: string[] = [];

  for (let i = 0; i < blockData.children.length - 1; i++) {
    const currentChildId = blockData.children[i];
    const nextChildId = blockData.children[i + 1];
    const currentBlockType = hash[currentChildId].block_type;
    const nextBlockType = hash[nextChildId].block_type;

    if (
      currentBlockType === nextBlockType &&
      currentBlockType === orderdListBlockType
    ) {
      currentGroup.push(currentChildId);
      if (i === blockData.children.length - 2) {
        currentGroup.push(nextChildId);
        blockDataArr.push(currentGroup);
        currentGroup = [];
      }
    } else {
      if (currentGroup.length > 0) {
        currentGroup.push(currentChildId);
        blockDataArr.push(currentGroup);
        currentGroup = [];
      } else {
        blockDataArr.push([currentChildId]);
      }
      if (i === blockData.children.length - 2) {
        blockDataArr.push([nextChildId]);
      }
    }
  }

  return blockDataArr;
}
