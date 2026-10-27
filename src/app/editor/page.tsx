'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  CanvasElement, 
  Product, 
  WebtoonIP, 
  DesignAsset, 
  DesignProject 
} from '@/types';
import { renderElementsToCanvas, exportHighResPrintFile } from '@/lib/canvasUtils';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { 
  Palette, 
  Type, 
  Smile, 
  Square, 
  Layers, 
  RotateCw, 
  Trash2, 
  Save, 
  ShoppingCart, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Sparkles,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Scissors,
  Maximize2,
  Minimize2,
  Crosshair
} from 'lucide-react';

export default function EditorPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400">
        에디터 스튜디오를 불러오는 중...
      </div>
    }>
      <EditorComponent />
    </Suspense>
  );
}

function EditorComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    webtoons, 
    products, 
    templates, 
    assets, 
    projects, 
    saveProject, 
    currentUser 
  } = useAppStore();

  const ipParam = searchParams.get('ipId');
  const prodParam = searchParams.get('productId');
  const projParam = searchParams.get('projectId');

  // Selected State
  const [selectedIP, setSelectedIP] = useState<WebtoonIP>(
    webtoons.find((w) => w.id === ipParam) || webtoons[0]
  );
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    products.find((p) => p.id === prodParam) || products[0]
  );

  // Canvas State
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#0B1329');
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<boolean>(false); // 포토카드 실물 다이컷(재단완료) 미리보기 모드
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [projectTitle, setProjectTitle] = useState<string>('나만의 웹툰 굿즈');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'STICKERS' | 'FRAMES' | 'TEXT' | 'BG'>('ASSETS');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Available Backgrounds
  const bgPalette = ['#0B1329', '#831843', '#18181B', '#FDF4FF', '#0F172A', '#1E1B4B', '#FFFFFF'];

  // Load existing project or template
  useEffect(() => {
    if (projParam) {
      const existing = projects.find((p) => p.id === projParam);
      if (existing) {
        setProjectTitle(existing.title);
        setElements(existing.elements);
        setBackgroundColor(existing.background);
        const matchIP = webtoons.find((w) => w.id === existing.ipId);
        if (matchIP) setSelectedIP(matchIP);
        const matchProd = products.find((p) => p.id === existing.productId);
        if (matchProd) setSelectedProduct(matchProd);
        return;
      }
    }

    // Default template fallback
    const tpl = templates.find(
      (t) => t.ipId === selectedIP.id && t.productId === selectedProduct.id
    ) || templates[0];

    if (tpl) {
      setElements(tpl.defaultElements);
      setProjectTitle(`${selectedIP.title} - ${selectedProduct.name}`);
    }
  }, [projParam, selectedIP.id, selectedProduct.id]);

  // Redraw Canvas whenever elements or background change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderElementsToCanvas(ctx, elements, canvas.width, canvas.height, backgroundColor);
  }, [elements, backgroundColor]);

  // Selected Element helper
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Update selected element property
  const updateSelectedElement = (props: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, ...props } : el))
    );
  };

  // 포토카드 재단 툴 헬퍼: 캔버스 꽉 채우기 (Fit to Bleed)
  const fitToBleed = () => {
    const targetId = selectedElementId || elements.find((el) => el.type === 'image')?.id;
    if (!targetId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === targetId ? { ...el, x: 0, y: 0, width: canvasWidth, height: canvasHeight } : el
      )
    );
  };

  // 포토카드 재단 툴 헬퍼: 안전 영역 맞춤 (Fit to Safe Zone - 3mm 마진)
  const fitToSafeZone = () => {
    const margin = 18;
    const targetW = canvasWidth - margin * 2;
    const targetH = canvasHeight - margin * 2;
    const targetId = selectedElementId || elements.find((el) => el.type === 'image')?.id;
    if (!targetId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === targetId ? { ...el, x: margin, y: margin, width: targetW, height: targetH } : el
      )
    );
  };

  // 포토카드 재단 툴 헬퍼: 중앙 정렬
  const centerElement = () => {
    const targetId = selectedElementId || elements.find((el) => el.type === 'image')?.id;
    if (!targetId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== targetId) return el;
        const centerX = Math.round((canvasWidth - el.width) / 2);
        const centerY = Math.round((canvasHeight - el.height) / 2);
        return { ...el, x: centerX, y: centerY };
      })
    );
  };

  // Add Asset to Canvas
  const handleAddAsset = (asset: DesignAsset) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: asset.type === 'CHARACTER' ? 'image' : asset.type === 'FRAME' ? 'frame' : 'sticker',
      src: asset.assetUrl,
      name: asset.name,
      x: 30,
      y: 40,
      width: asset.type === 'FRAME' ? 280 : 180,
      height: asset.type === 'FRAME' ? 440 : 200,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Add Text to Canvas
  const handleAddText = () => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: 'text',
      text: '나만의 문구 입력',
      fontFamily: 'sans-serif',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      x: 50,
      y: 200,
      width: 240,
      height: 30,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Change Layer zIndex
  const handleLayerMove = (direction: 'up' | 'down') => {
    if (!selectedElement) return;
    const currentZ = selectedElement.zIndex;
    const targetZ = direction === 'up' ? currentZ + 1 : Math.max(1, currentZ - 1);
    updateSelectedElement({ zIndex: targetZ });
  };

  // Save Project
  const handleSave = () => {
    setIsSaving(true);
    const canvas = canvasRef.current;
    const previewDataUrl = canvas ? canvas.toDataURL('image/png') : undefined;

    const project: DesignProject = {
      id: projParam || `proj-${Date.now()}`,
      userId: currentUser.id,
      productId: selectedProduct.id,
      ipId: selectedIP.id,
      title: projectTitle,
      elements,
      background: backgroundColor,
      previewDataUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(project);

    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('디자인 프로젝트가 내 보관함에 성공적으로 저장되었습니다!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  // Export & Proceed to Checkout
  const handleCheckout = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    try {
      const highResDataUrl = await exportHighResPrintFile(
        elements,
        selectedProduct,
        backgroundColor
      );

      const project: DesignProject = {
        id: projParam || `proj-${Date.now()}`,
        userId: currentUser.id,
        productId: selectedProduct.id,
        ipId: selectedIP.id,
        title: projectTitle,
        elements,
        background: backgroundColor,
        previewDataUrl: canvas.toDataURL('image/png'),
        printFileDataUrl: highResDataUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveProject(project);

      // Navigate to checkout with projectId query
      router.push(`/checkout?projectId=${project.id}`);
    } catch {
      alert('고해상도 인쇄 파일 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // Canvas aspect ratio dimensions
  // Standard photocard 55:85 ratio => width 340px, height 525px
  const canvasWidth = 340;
  const canvasHeight = Math.round((340 * selectedProduct.heightMm) / selectedProduct.widthMm);

  // Filter assets by current IP
  const currentIPAssets = assets.filter((a) => a.ipId === selectedIP.id);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white min-h-[calc(100vh-4rem)]">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent font-bold text-sm text-white focus:outline-none border-b border-transparent focus:border-indigo-500 px-1"
            />
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{selectedIP.title}</span>
              <span>•</span>
              <span className="text-indigo-400 font-semibold">{selectedProduct.name}</span>
            </div>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">임시저장</span>
          </Button>

          <Button
            size="sm"
            onClick={handleCheckout}
            isLoading={isSaving}
            className="shadow-indigo-500/30"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>최종 주문하기</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: Asset Palette & Tabs */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
          {/* IP & Product Quick Selector */}
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">작품 및 규격 변경</span>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3 h-3" />
                <span>정식 라이선스</span>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedIP.id}
                onChange={(e) => {
                  const found = webtoons.find((w) => w.id === e.target.value);
                  if (found) setSelectedIP(found);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                {webtoons.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title}
                  </option>
                ))}
              </select>

              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const found = products.find((p) => p.id === e.target.value);
                  if (found) setSelectedProduct(found);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Palette Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/80">
            <button
              onClick={() => setActiveTab('ASSETS')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'ASSETS'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              캐릭터
            </button>
            <button
              onClick={() => setActiveTab('STICKERS')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'STICKERS'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              스티커
            </button>
            <button
              onClick={() => setActiveTab('FRAMES')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'FRAMES'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              프레임
            </button>
            <button
              onClick={() => setActiveTab('TEXT')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'TEXT'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              텍스트
            </button>
            <button
              onClick={() => setActiveTab('BG')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'BG'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              배경
            </button>
          </div>

          {/* Palette Items Body */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'ASSETS' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  {selectedIP.title}의 공식 고화질 캐릭터 에셋입니다. 클릭하여 캔버스에 추가하세요.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {currentIPAssets
                    .filter((a) => a.type === 'CHARACTER')
                    .map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => handleAddAsset(asset)}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-2 hover:border-indigo-500 transition-all group flex flex-col items-center"
                      >
                        <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-900/50 flex items-center justify-center mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.assetUrl}
                            alt={asset.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-300 truncate w-full text-center">
                          {asset.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'STICKERS' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  웹툰 컷 스탬프 및 스파클 데코 스티커입니다.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {assets
                    .filter((a) => a.type === 'STICKER' || a.type === 'SPEECH_BUBBLE')
                    .map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => handleAddAsset(asset)}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3 hover:border-indigo-500 transition-all flex flex-col items-center justify-center gap-2"
                      >
                        <div className="h-16 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.assetUrl}
                            alt={asset.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                          {asset.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'FRAMES' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  폴라로이드 및 홀로그램 엣지 프레임입니다.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {assets
                    .filter((a) => a.type === 'FRAME')
                    .map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => handleAddAsset(asset)}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-2 hover:border-indigo-500 transition-all flex flex-col items-center"
                      >
                        <div className="aspect-[3/4] w-full rounded-lg bg-slate-900 flex items-center justify-center mb-1.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.assetUrl}
                            alt={asset.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                          {asset.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'TEXT' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  포토카드에 넣을 이름, 대사, 날짜 문구를 추가하세요.
                </p>
                <Button onClick={handleAddText} className="w-full">
                  <Type className="w-4 h-4" />
                  <span>새 텍스트 추가</span>
                </Button>
              </div>
            )}

            {activeTab === 'BG' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">캔버스 기본 배경 색상을 선택하세요.</p>
                <div className="flex flex-wrap gap-2.5">
                  {bgPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center ${
                        backgroundColor === color
                          ? 'border-indigo-500 scale-110 shadow-lg shadow-indigo-500/30'
                          : 'border-slate-700'
                      }`}
                    >
                      {backgroundColor === color && (
                        <Check className={`w-4 h-4 ${color === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Canvas Workspace (포토카드 출력·재단 툴 스튜디오) */}
        <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center overflow-auto relative select-none">
          {/* Print & Die-cut Tool Action Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 text-xs shadow-xl z-10">
            <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>300 DPI</span>
              </span>
              <span className="text-slate-400 font-medium">
                {selectedProduct.widthMm}x{selectedProduct.heightMm}mm
              </span>
            </div>

            {/* Quick Auto-Fit & Alignment Tools */}
            <div className="flex items-center gap-1.5 px-1">
              <button
                onClick={fitToBleed}
                title="재단 여백까지 캔버스 꽉 채우기"
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
              >
                <Maximize2 className="w-3 h-3 text-indigo-400" />
                <span>꽉 채우기</span>
              </button>

              <button
                onClick={fitToSafeZone}
                title="잘림 없는 안전 영역(3mm 안쪽)에 맞추기"
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
              >
                <Minimize2 className="w-3 h-3 text-emerald-400" />
                <span>안전 영역</span>
              </button>

              <button
                onClick={centerElement}
                title="캔버스 정중앙 정렬"
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
              >
                <Crosshair className="w-3 h-3 text-amber-400" />
                <span>중앙 정렬</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {/* Guides Toggle */}
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border font-semibold transition-all ${
                  showGuides
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {showGuides ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>재단선 {showGuides ? 'ON' : 'OFF'}</span>
              </button>

              {/* Die-cut Real Preview Toggle */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all shadow-md ${
                  previewMode
                    ? 'bg-gradient-to-r from-pink-600 to-indigo-600 border-indigo-400 text-white shadow-indigo-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{previewMode ? '편집 모드로' : '실물 카드 보기'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper with Visual Guidelines & Registration Crop Marks */}
          <div className="relative p-4">
            {/* Registration Crop Marks (인쇄소 십자 정합 재단 눈금) */}
            {!previewMode && showGuides && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Top-Left Crop Mark */}
                <div className="absolute top-1 left-1 w-3 h-0.5 bg-rose-500/70" />
                <div className="absolute top-1 left-1 w-0.5 h-3 bg-rose-500/70" />
                {/* Top-Right Crop Mark */}
                <div className="absolute top-1 right-1 w-3 h-0.5 bg-rose-500/70" />
                <div className="absolute top-1 right-1 w-0.5 h-3 bg-rose-500/70" />
                {/* Bottom-Left Crop Mark */}
                <div className="absolute bottom-1 left-1 w-3 h-0.5 bg-rose-500/70" />
                <div className="absolute bottom-1 left-1 w-0.5 h-3 bg-rose-500/70" />
                {/* Bottom-Right Crop Mark */}
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-rose-500/70" />
                <div className="absolute bottom-1 right-1 w-0.5 h-3 bg-rose-500/70" />
              </div>
            )}

            {/* Core Card Canvas Container */}
            <div
              className={`relative shadow-2xl transition-all duration-300 ${
                previewMode
                  ? 'rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.4)]'
                  : 'rounded-none shadow-slate-950/80 ring-1 ring-slate-800'
              }`}
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${zoomLevel / 100})`,
              }}
            >
              {/* HTML5 Canvas */}
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="w-full h-full block"
              />

              {/* Glossy Hologram Highlight Overlay in Real Preview Mode */}
              {previewMode && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent mix-blend-overlay" />
              )}

              {/* Print Guide Lines Overlay (재단선·안전선) */}
              {!previewMode && showGuides && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Bleed line (2mm 여백 - 빨간색 점선) */}
                  <div className="absolute inset-0 border-2 border-dashed border-rose-500/70">
                    <span className="absolute top-1 left-1.5 text-[9px] font-bold text-rose-400 bg-slate-950/80 px-1 py-0.5 rounded leading-none">
                      외곽 재단 여백(Bleed 2mm)
                    </span>
                  </div>

                  {/* Cut Line / Trim line (55x85mm R4 라운드 다이커팅 칼선 - 노란색 라인) */}
                  <div className="absolute inset-2 border-2 border-amber-400/90 rounded-2xl">
                    <span className="absolute top-1 right-1.5 text-[9px] font-bold text-amber-300 bg-slate-950/80 px-1 py-0.5 rounded leading-none flex items-center gap-0.5">
                      <Scissors className="w-2.5 h-2.5 inline" />
                      <span>재단 칼선(R4 다이컷)</span>
                    </span>
                  </div>

                  {/* Safe zone line (3mm 안쪽 마진 - 초록색 점선) */}
                  <div className="absolute inset-4 border border-dashed border-emerald-400/80 rounded-xl">
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-emerald-400 bg-slate-950/80 px-1 py-0.5 rounded leading-none">
                      안전 영역(Safe Zone)
                    </span>
                  </div>
                </div>
              )}

              {/* Interactive Elements Overlay for Click/Selection & Drag */}
              {!previewMode && (
                <div className="absolute inset-0">
                  {elements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    return (
                      <div
                        key={el.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                        }}
                        style={{
                          left: el.x,
                          top: el.y,
                          width: el.width,
                          height: el.height,
                          transform: `rotate(${el.rotation}deg)`,
                          zIndex: el.zIndex,
                        }}
                        className={`absolute cursor-move select-none ${
                          isSelected
                            ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-slate-900'
                            : 'hover:ring-1 hover:ring-indigo-400/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Guide Legend */}
          {!previewMode && showGuides ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                <span>재단 여백 (Bleed 2mm)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                <span>실제 재단 칼선 (R4 라운드 55x85mm)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                <span>인쇄 안전 영역 (Safe Zone 3mm)</span>
              </span>
            </div>
          ) : previewMode ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-indigo-300 font-semibold bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>실제 키오스크 및 인쇄소에서 R4 라운드 코너로 재단되어 출력되는 실물 모습입니다.</span>
            </div>
          ) : null}
        </div>

        {/* Right: Property Inspector Panel */}
        <div className="w-full md:w-72 border-l border-slate-800 bg-slate-900/50 p-4 shrink-0 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              오브젝트 속성 설정
            </h3>

            {selectedElement ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white truncate max-w-[150px]">
                    {selectedElement.name || selectedElement.text || '선택된 요소'}
                  </span>
                  <button
                    onClick={() => handleDeleteElement(selectedElement.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="요소 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Edit Controls */}
                {selectedElement.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">문구 내용</label>
                      <input
                        type="text"
                        value={selectedElement.text || ''}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">글자 크기</label>
                        <input
                          type="number"
                          value={selectedElement.fontSize || 16}
                          onChange={(e) =>
                            updateSelectedElement({ fontSize: Number(e.target.value) })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">글자 색상</label>
                        <input
                          type="color"
                          value={selectedElement.color || '#FFFFFF'}
                          onChange={(e) => updateSelectedElement({ color: e.target.value })}
                          className="w-full h-8 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Transform Controls (Position & Size) */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">가로 X (px)</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.x)}
                        onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">세로 Y (px)</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.y)}
                        onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>크기 조절 (가로폭)</span>
                      <span>{Math.round(selectedElement.width)}px</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="400"
                      value={selectedElement.width}
                      onChange={(e) => {
                        const newWidth = Number(e.target.value);
                        const ratio = selectedElement.height / selectedElement.width;
                        updateSelectedElement({
                          width: newWidth,
                          height: Math.round(newWidth * ratio),
                        });
                      }}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>회전 각도</span>
                      <span>{selectedElement.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedElement.rotation}
                      onChange={(e) =>
                        updateSelectedElement({ rotation: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  {/* Layer Z-Index Move */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">레이어 순서</label>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleLayerMove('up')}
                        className="flex-1"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>앞으로</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleLayerMove('down')}
                        className="flex-1"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>뒤로</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                캔버스 위의 캐릭터나 스티커를 클릭하면 상세 속성을 조절할 수 있습니다.
              </div>
            )}
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-indigo-600/90 text-white text-xs font-semibold shadow-lg text-center animate-fade-in">
              {toastMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
