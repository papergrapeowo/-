import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { artifacts } from "../data/artifacts";
import { useLanguage } from "../contexts/LanguageContext";

export function PuzzleGame() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // 选取第一个文物作为当前关卡，你也可以根据路由传参选择
  const [currentArtifact] = useState(artifacts[0]);
  const [pieces, setPieces] = useState<number[]>([]); // 存储每个格子的内容索引
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const gridSize = 3; 
  const emptyIndex = gridSize * gridSize - 1; // 最后一个格子定义为空白

  // 初始化并确保可解
  const initializePuzzle = useCallback(() => {
    let newPieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    
    // 模拟从正确位置开始移动 100 次来打乱，确保百分之百可解
    let currentEmpty = emptyIndex;
    for (let i = 0; i < 100; i++) {
      const neighbors = getNeighbors(currentEmpty);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [newPieces[currentEmpty], newPieces[randomNeighbor]] = [newPieces[randomNeighbor], newPieces[currentEmpty]];
      currentEmpty = randomNeighbor;
    }

    setPieces(newPieces);
    setMoves(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  // 获取某个索引的相邻索引（上下左右）
  function getNeighbors(index: number) {
    const neighbors = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    if (row > 0) neighbors.push(index - gridSize); // 上
    if (row < gridSize - 1) neighbors.push(index + gridSize); // 下
    if (col > 0) neighbors.push(index - 1); // 左
    if (col < gridSize - 1) neighbors.push(index + 1); // 右
    return neighbors;
  }

  const handlePieceClick = (index: number) => {
    if (isComplete) return;

    // 找到空白格子的当前索引
    const currentEmptyIndex = pieces.indexOf(emptyIndex);
    const neighbors = getNeighbors(currentEmptyIndex);

    // 如果点击的是空白格子的邻居，则交换
    if (neighbors.includes(index)) {
      const newPieces = [...pieces];
      [newPieces[index], newPieces[currentEmptyIndex]] = [newPieces[currentEmptyIndex], newPieces[index]];
      setPieces(newPieces);
      setMoves(prev => prev + 1);

      // 检查是否胜利
      if (newPieces.every((piece, i) => piece === i)) {
        setIsComplete(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-10">
      {/* 顶部状态栏 */}
      <div className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <button onClick={() => navigate("/games")} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-gray-800">{t('文物修复计划')}</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('Puzzle Challenge')}</p>
        </div>
        <button onClick={initializePuzzle} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 flex flex-col items-center">
        {/* 游戏进度信息 */}
        <div className="w-full flex justify-between items-end mb-6">
          <div>
            <span className="text-xs text-gray-400 block mb-1">{t('正在修复')}</span>
            <h2 className="text-lg font-bold text-[#2F3E46]">{currentArtifact.name}</h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block mb-1">{t('移动步数')}</span>
            <span className="text-xl font-mono font-bold text-blue-600">{moves}</span>
          </div>
        </div>

        {/* 拼图主区域 */}
        <div className="relative w-full aspect-square bg-gray-200 rounded-2xl p-1.5 shadow-inner">
          <div className="grid grid-cols-3 gap-1 h-full w-full">
            {pieces.map((pieceIndex, i) => {
              const isBlank = pieceIndex === emptyIndex;
              // 计算原图中的行列位置
              const correctRow = Math.floor(pieceIndex / gridSize);
              const correctCol = pieceIndex % gridSize;

              return (
                <div
                  key={pieceIndex}
                  onClick={() => handlePieceClick(i)}
                  className={`relative rounded-lg overflow-hidden transition-all duration-200 active:scale-95 ${
                    isBlank ? "bg-gray-200/50" : "bg-white shadow-sm cursor-pointer border border-white/20"
                  }`}
                  style={{
                    backgroundImage: isBlank ? "none" : `url(${currentArtifact.image})`,
                    backgroundSize: `${gridSize * 100}%`,
                    backgroundPosition: `${(correctCol * 100) / (gridSize - 1)}% ${(correctRow * 100) / (gridSize - 1)}%`,
                  }}
                >
                  {!isBlank && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                      <span className="text-[8px] text-white/30">{pieceIndex + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 辅助工具 */}
        <div className="mt-8 w-full flex gap-3">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl text-sm font-medium border border-gray-100 shadow-sm"
          >
            <Lightbulb size={16} className={showHint ? "text-yellow-500" : "text-gray-400"} />
            {showHint ? t('隐藏原图') : t('查看原图')}
          </button>
        </div>

        {showHint && (
          <div className="mt-4 p-2 bg-white rounded-lg shadow-sm animate-in fade-in zoom-in duration-300">
            <img src={currentArtifact.image} alt="Hint" className="w-32 h-32 object-cover rounded shadow-inner opacity-60" />
          </div>
        )}
      </div>

      {/* 胜利弹窗 [cite: 125, 121] */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('修复成功！')}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t('你只用了 {moves} 步就让 {artifactName} 焕发新生。', { moves, artifactName: currentArtifact.name })}
            </p>
            <div className="space-y-3">
              <button
                onClick={initializePuzzle}
                className="w-full bg-[#2F3E46] text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                {t('挑战下一关')}
              </button>
              <button
                onClick={() => navigate("/games")}
                className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl text-sm"
              >
                {t('回到大厅')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}