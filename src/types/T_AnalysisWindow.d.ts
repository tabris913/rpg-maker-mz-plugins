declare const TAW: {
  isEnableTCP: boolean;
};

interface Scene_Battle {
  createAnalysisToggleWindow: () => void;
  createAnalysisInfoWindow: () => void;
  analysisToggleWindowRect: () => Rectangle;
  analysisInfoWindowRect: () => Rectangle;
  commandAnalysis: () => void;

  isCurrentCommandAnalysis: () => boolean;
  selectSelectionForAnalysis: (
    oldWindow: Window_BattleActor | Window_BattleEnemy,
    newWindow: Window_BattleActor | Window_BattleEnemy,
    from?: "left" | "right",
  ) => void;

  onAnalysisToggleOk: (type: "actor" | "enemy") => void;
  onAnalysisToggleCancel: () => void;
  onAnalysisTargetOk: (type: "actor" | "enemy") => void;
  onAnalysisTargetCancel: () => void;
  onAnalysisInfoCancel: () => void;
}
