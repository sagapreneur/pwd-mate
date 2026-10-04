import React, { useState, useMemo } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { SSR_MASTER_ITEMS, SSR_CHAPTERS } from '../../data/ssrMaster';
import { SSRItem, FloorTag } from '../../types/estimator';
import { calculateDynamicItemRate } from '../../engine/calculationEngine';
import {
  Search,
  Plus,
  PlusCircle,
  Check,
  Layers,
  Sparkles,
  Ruler,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';

export const SSRCatalogModule: React.FC = () => {
  const { addItemFromSSR, addCustomItem, leadSettings, facesheet, items } = useEstimatorStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);

  // Inline Quick Take-off State
  const [expandedTakeoffId, setExpandedTakeoffId] = useState<string | null>(null);
  const [takeoffData, setTakeoffData] = useState<{
    label: string;
    floorTag: FloorTag;
    multiplier: number;
    length: number;
    breadth: number;
    depth: number;
  }>({
    label: 'Main Work Item',
    floorTag: 'GF',
    multiplier: 1.0,
    length: 1.0,
    breadth: 1.0,
    depth: 1.0,
  });

  // Custom Item Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCode, setCustomCode] = useState('N-SSR-01');
  const [customDesc, setCustomDesc] = useState('');
  const [customUnit, setCustomUnit] = useState('Cu.M');
  const [customRate, setCustomRate] = useState<number>(1000);

  // Popular quick-filter chapters
  const popularPills = [
    { id: 'ALL', label: 'All Items' },
    { id: 'Excavation', label: 'Excavation' },
    { id: 'Plain Cement Concrete', label: 'PCC' },
    { id: 'Reinforced Cement Concrete', label: 'RCC Concrete' },
    { id: 'Brick Masonry', label: 'Brickwork' },
    { id: 'Stone Masonry', label: 'Stone Masonry' },
    { id: 'Plastering and Pointing', label: 'Plastering' },
    { id: 'Paving Flooring and dado', label: 'Flooring' },
    { id: 'Road Sub Base and Base Course', label: 'Road GSB/WMM' },
    { id: 'Road Surfacing Course', label: 'Bituminous' },
    { id: 'Water Supply and  Sanitary Fitting', label: 'Sanitary / Plumbing' },
    { id: 'Bridge Super Structure', label: 'Bridges' },
    { id: 'Roofing and Ceiling', label: 'Roofing' },
    { id: 'Water Proofing', label: 'Waterproofing' },
  ];

  // Filter items efficiently
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SSR_MASTER_ITEMS.filter((item) => {
      const matchesSearch =
        !q ||
        item.itemCode.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.chapterName.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q);

      const matchesChapter =
        selectedChapter === 'ALL' ||
        item.chapterName.toLowerCase() === selectedChapter.toLowerCase() ||
        String(item.chapterNumber) === selectedChapter;

      return matchesSearch && matchesChapter;
    });
  }, [searchQuery, selectedChapter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (currentSafePage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentSafePage, pageSize]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleChapterChange = (ch: string) => {
    setSelectedChapter(ch);
    setCurrentPage(1);
  };

  const handleQuickAdd = (ssrItem: SSRItem) => {
    addItemFromSSR(ssrItem);
    setAddedItemCode(ssrItem.itemCode);
    setTimeout(() => setAddedItemCode(null), 1500);
  };

  const toggleTakeoff = (itemId: string, defaultDesc: string) => {
    if (expandedTakeoffId === itemId) {
      setExpandedTakeoffId(null);
    } else {
      setExpandedTakeoffId(itemId);
      setTakeoffData({
        label: defaultDesc.length > 50 ? defaultDesc.substring(0, 48) + '...' : defaultDesc,
        floorTag: 'GF',
        multiplier: 1.0,
        length: 1.0,
        breadth: 1.0,
        depth: 1.0,
      });
    }
  };

  const handleAddWithDimensions = (ssrItem: SSRItem) => {
    addItemFromSSR(ssrItem, {
      floorTag: takeoffData.floorTag,
      label: takeoffData.label || 'Main Work Item',
      multiplier: takeoffData.multiplier,
      length: takeoffData.length,
      breadth: takeoffData.breadth,
      depth: takeoffData.depth,
      isDeduction: false,
    });
    setAddedItemCode(ssrItem.itemCode);
    setExpandedTakeoffId(null);
    setTimeout(() => setAddedItemCode(null), 1500);
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDesc.trim()) return;

    addCustomItem({
      itemCode: customCode,
      description: customDesc,
      unit: customUnit,
      baseRate: Number(customRate),
      consumptionFactors: {},
    });

    setShowCustomModal(false);
    setCustomDesc('');
    setCustomCode('N-SSR-0' + (items.length + 2));
  };

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div className="bg-white rounded-xl shadow-xs border border-[#E5E7EB] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#81C303] uppercase tracking-wider bg-[#FBFFEB] px-2.5 py-0.5 rounded-full border border-[#81C303]/30">
                Maharashtra PWD Schedule of Rates
              </span>
              <span className="text-[11px] text-[#64748B] font-mono">
                {SSR_MASTER_ITEMS.length.toLocaleString()} Items • {SSR_CHAPTERS.length} Chapters
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#02013F] mt-1">
              SSR Master Item Catalog ({facesheet.ssrYear})
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Comprehensive official Maharashtra PWD Schedule of Rates with dynamic lead transport analysis, material factors, and dimensional take-off.
            </p>
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#02013F] hover:bg-[#14136e] text-white text-xs font-semibold shadow-xs transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#81C303]" />
            <span>Add Custom Non-SSR Item</span>
          </button>
        </div>

        {/* Search Bar & Chapter Select */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search across all 2,382 SSR items by item code (e.g. 21.01, 24.01, 26.33), keyword or specification..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#81C303]/30 focus:border-[#81C303] outline-none bg-white text-[#111827] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Comprehensive All-Chapters Dropdown */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <div className="flex items-center space-x-1.5 border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 bg-white shadow-xs">
                <Filter className="w-3.5 h-3.5 text-[#81C303] shrink-0" />
                <select
                  value={selectedChapter}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#02013F] outline-none cursor-pointer"
                >
                  <option value="ALL">All Chapters ({SSR_MASTER_ITEMS.length.toLocaleString()} items)</option>
                  {SSR_CHAPTERS.map((ch) => (
                    <option key={ch.name} value={ch.name}>
                      {ch.name} ({ch.count} items)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick-filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-[#64748B] mr-1 flex items-center space-x-1">
              <SlidersHorizontal className="w-3 h-3 text-[#81C303]" />
              <span>Quick:</span>
            </span>
            {popularPills.map((pill) => {
              const isSelected = selectedChapter.toLowerCase() === pill.id.toLowerCase();
              return (
                <button
                  key={pill.id}
                  onClick={() => handleChapterChange(pill.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                    isSelected
                      ? 'bg-[#81C303] text-[#02013F] font-bold shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#FBFFEB] hover:text-[#02013F] border border-[#E5E7EB]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalog Results Grid & Pagination Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#64748B] px-1 font-medium gap-2">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-[#02013F]">{filteredItems.length === 0 ? 0 : (currentSafePage - 1) * pageSize + 1}</strong> –{' '}
              <strong className="text-[#02013F]">{Math.min(currentSafePage * pageSize, filteredItems.length)}</strong> of{' '}
              <strong className="text-[#02013F]">{filteredItems.length.toLocaleString()}</strong> items
            </span>
            {searchQuery && (
              <span className="bg-[#FBFFEB] text-[#02013F] px-2 py-0.5 rounded text-[11px] border border-[#81C303]/30">
                Filtered by "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span>
              Area Surcharge: <strong className="text-[#02013F]">+{facesheet.areaSurchargePercent}%</strong> | SCADA:{' '}
              <strong className={facesheet.scadaDeductionActive ? 'text-emerald-700' : 'text-slate-400'}>
                {facesheet.scadaDeductionActive ? 'Active' : 'Off'}
              </strong>
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center space-x-1">
              <span className="text-[11px] text-slate-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#E5E7EB] rounded text-xs px-1.5 py-0.5 font-semibold text-[#02013F]"
              >
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty Search Result */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FBFFEB] text-[#81C303] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#02013F]">No Matching SSR Items Found</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              No official schedule item matched "{searchQuery}". Try searching with a different item number or clear your chapter filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedChapter('ALL');
                setCurrentPage(1);
              }}
              className="px-4 py-1.5 bg-[#81C303] text-[#02013F] font-bold text-xs rounded-lg shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Item Cards List */}
        <div className="grid grid-cols-1 gap-3">
          {paginatedItems.map((item) => {
            // Live lead preview rate
            const ratePreview = calculateDynamicItemRate(
              item.baseRate,
              leadSettings,
              item.defaultCF,
              facesheet.areaSurchargePercent,
              'GF',
              item.scadaApplicable,
              facesheet.scadaDeductionActive,
              facesheet.scadaDeductionAmount,
              item.bitumenQtyPerUnit,
              facesheet.currentBitumenRate,
              facesheet.ssrBitumenRate
            );

            const isAdded = addedItemCode === item.itemCode;
            const alreadyInEstimate = items.some((it) => it.itemCode === item.itemCode);
            const isTakeoffOpen = expandedTakeoffId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  isTakeoffOpen
                    ? 'border-[#81C303] ring-1 ring-[#81C303] shadow-md'
                    : 'border-[#E5E7EB] hover:border-[#81C303] hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Item Details */}
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-[#02013F] text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono shadow-2xs">
                        Item {item.itemCode}
                      </span>
                      <span className="text-[11px] text-[#02013F] font-semibold bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {item.chapterName}
                      </span>
                      {item.scadaApplicable && (
                        <span className="text-[10px] text-sky-800 bg-sky-50 border border-sky-200 font-bold px-1.5 py-0.5 rounded font-mono">
                          SCADA REBATE
                        </span>
                      )}
                      {alreadyInEstimate && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-300 font-bold px-1.5 py-0.5 rounded">
                          IN ESTIMATE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#111827] leading-relaxed pt-0.5">{item.description}</p>

                    {/* Material Consumption Factors preview tag */}
                    {Object.keys(item.defaultCF).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#64748B] pt-1">
                        <span className="font-semibold flex items-center space-x-1 text-[#02013F]">
                          <Layers className="w-3 h-3 text-[#81C303]" />
                          <span>Materials:</span>
                        </span>
                        {Object.entries(item.defaultCF).map(([k, v]) => (
                          <span
                            key={k}
                            className="bg-[#FBFFEB] text-[#02013F] font-mono px-1.5 py-0.2 rounded border border-[#81C303]/30 font-medium"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rate Card & Actions */}
                  <div className="flex items-center space-x-3 shrink-0 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5E7EB]">
                    <div className="text-right">
                      <div className="text-[10px] text-[#64748B] uppercase font-semibold">Basic SSR</div>
                      <div className="text-xs font-semibold text-[#111827] tabular-nums-force">
                        ₹{item.baseRate.toFixed(2)} / {item.unit}
                      </div>
                    </div>

                    <div className="text-right pl-3 border-l border-[#E5E7EB]">
                      <div className="text-[10px] text-[#81C303] uppercase font-bold flex items-center justify-end space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Live Lead Rate</span>
                      </div>
                      <div className="text-sm font-bold text-[#02013F] tabular-nums-force">
                        ₹{ratePreview.finalRate.toFixed(2)} / {item.unit}
                      </div>
                    </div>

                    {/* Action 1: Quick Take-off Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleTakeoff(item.id, item.description)}
                      title="Enter Length x Breadth x Depth dimensions"
                      className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        isTakeoffOpen
                          ? 'bg-[#02013F] text-white border-[#02013F]'
                          : 'bg-white text-[#02013F] border-[#E5E7EB] hover:bg-slate-100'
                      }`}
                    >
                      <Ruler className="w-3.5 h-3.5 text-[#81C303]" />
                      <span className="hidden sm:inline">Take-off</span>
                      {isTakeoffOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                    </button>

                    {/* Action 2: Direct Fast Add */}
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        isAdded
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-[#81C303] hover:bg-[#72ad02] text-[#02013F] hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Quick Take-off Form */}
                {isTakeoffOpen && (
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB] bg-[#FBFFEB]/50 p-3 rounded-lg space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-[#02013F]">
                      <span className="flex items-center space-x-1.5">
                        <Ruler className="w-4 h-4 text-[#81C303]" />
                        <span>Inline Dimensional Take-Off (L × B × D/H)</span>
                      </span>
                      <span className="text-[11px] text-[#02013F] font-semibold bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                        Computed Take-Off:{' '}
                        <strong className="text-emerald-700 font-mono text-xs">
                          {(takeoffData.multiplier * takeoffData.length * takeoffData.breadth * takeoffData.depth).toFixed(3)}{' '}
                          {item.unit}
                        </strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                      <div className="col-span-2">
                        <label className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Detail Label:</label>
                        <input
                          type="text"
                          value={takeoffData.label}
                          onChange={(e) => setTakeoffData({ ...takeoffData, label: e.target.value })}
                          className="w-full px-2 py-1.5 border border-[#E5E7EB] rounded text-xs bg-white focus:ring-1 focus:ring-[#02013F] text-[#111827]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Floor Level:</label>
                        <select
                          value={takeoffData.floorTag}
                          onChange={(e) => setTakeoffData({ ...takeoffData, floorTag: e.target.value as FloorTag })}
                          className="w-full px-1.5 py-1.5 border border-[#E5E7EB] rounded text-xs bg-white font-semibold text-[#02013F]"
                        >
                          <option value="GF">Ground Floor</option>
                          <option value="1F">1st Floor (+1.0%)</option>
                          <option value="2F">2nd Floor (+2.0%)</option>
                          <option value="3F">3rd Floor (+3.0%)</option>
                          <option value="4F">4th Floor (+4.0%)</option>
                          <option value="BASEMENT">Basement</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Nos (Count):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.multiplier}
                          onChange={(e) => setTakeoffData({ ...takeoffData, multiplier: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-[#E5E7EB] rounded text-xs bg-white text-right font-mono text-[#111827]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Length (L):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.length}
                          onChange={(e) => setTakeoffData({ ...takeoffData, length: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-[#E5E7EB] rounded text-xs bg-white text-right font-mono text-[#111827]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#64748B] font-semibold block mb-0.5">Breadth (B):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.breadth}
                          onChange={(e) => setTakeoffData({ ...takeoffData, breadth: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-[#E5E7EB] rounded text-xs bg-white text-right font-mono text-[#111827]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB]">
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] text-[#64748B] font-semibold">Depth / Height (D/H):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.depth}
                          onChange={(e) => setTakeoffData({ ...takeoffData, depth: parseFloat(e.target.value) || 0 })}
                          className="w-24 px-2 py-1 border border-[#E5E7EB] rounded text-xs bg-white text-right font-mono text-[#111827]"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setExpandedTakeoffId(null)}
                          className="px-3 py-1 text-xs text-[#64748B] hover:text-[#111827] font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddWithDimensions(item)}
                          className="px-4 py-1.5 bg-[#81C303] hover:bg-[#72ad02] text-[#02013F] rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            Add with Dimensions (
                            {(takeoffData.multiplier * takeoffData.length * takeoffData.breadth * takeoffData.depth).toFixed(2)}{' '}
                            {item.unit})
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-xs gap-3">
            <div className="text-xs text-[#64748B]">
              Page <strong className="text-[#02013F]">{currentSafePage}</strong> of{' '}
              <strong className="text-[#02013F]">{totalPages}</strong> ({filteredItems.length.toLocaleString()} items)
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={currentSafePage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2.5 py-1.5 rounded text-xs font-semibold border border-[#E5E7EB] bg-white text-[#02013F] hover:bg-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed"
                title="First Page"
              >
                « First
              </button>
              <button
                disabled={currentSafePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold border border-[#E5E7EB] bg-white text-[#02013F] hover:bg-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Page numbers window */}
              {(() => {
                let start = Math.max(1, currentSafePage - 2);
                let end = Math.min(totalPages, start + 4);
                if (end - start < 4) {
                  start = Math.max(1, end - 4);
                }
                const pages: number[] = [];
                for (let p = start; p <= end; p++) {
                  pages.push(p);
                }
                return pages.map((p) => {
                  const isCurrent = p === currentSafePage;
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#81C303] text-[#02013F] shadow-xs'
                          : 'bg-white text-[#64748B] hover:bg-[#F8FAFC] border border-[#E5E7EB]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              <button
                disabled={currentSafePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold border border-[#E5E7EB] bg-white text-[#02013F] hover:bg-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentSafePage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2.5 py-1.5 rounded text-xs font-semibold border border-[#E5E7EB] bg-white text-[#02013F] hover:bg-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last Page"
              >
                Last »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Non-SSR Item Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E7EB] w-full max-w-md p-6 space-y-4">
            <div className="border-b border-[#E5E7EB] pb-3">
              <h3 className="font-bold text-sm text-[#02013F]">Create Custom Non-SSR Work Item</h3>
              <p className="text-xs text-[#64748B]">Add proprietary or site-specific work not covered in standard SSR.</p>
            </div>

            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Custom Item Code</label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-[#E5E7EB] font-mono text-[#111827]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Full Technical Description</label>
                <textarea
                  rows={3}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Providing and applying specialized..."
                  className="w-full text-xs p-2 rounded border border-[#E5E7EB] text-[#111827]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">Unit of Measurement</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-[#E5E7EB] bg-[#F8FAFC] text-[#02013F] font-semibold"
                  >
                    <option value="Cu.M">Cu.M (Volume)</option>
                    <option value="Sqm">Sqm (Area)</option>
                    <option value="Rmt">Rmt (Running Length)</option>
                    <option value="Nos">Nos (Count)</option>
                    <option value="MT">MT (Weight)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">Base Unit Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-[#E5E7EB] font-semibold text-[#111827]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 text-xs text-[#64748B] hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#81C303] hover:bg-[#72ad02] text-[#02013F] font-bold rounded shadow-xs"
                >
                  Add to Estimate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
