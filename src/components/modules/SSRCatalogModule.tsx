import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { SSR_MASTER_ITEMS } from '../../data/ssrMaster';
import { SSRItem, FloorTag } from '../../types/estimator';
import { calculateDynamicItemRate } from '../../engine/calculationEngine';
import { Search, Plus, PlusCircle, Check, Layers, Sparkles, Ruler, ChevronDown, ChevronUp } from 'lucide-react';

export const SSRCatalogModule: React.FC = () => {
  const { addItemFromSSR, addCustomItem, leadSettings, facesheet, items } = useEstimatorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | 'ALL'>('ALL');
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null);

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

  const chapters = [
    { id: 'ALL', label: 'All Chapters' },
    { id: 21, label: 'Ch. 21 Excavation' },
    { id: 24, label: 'Ch. 24 PCC' },
    { id: 25, label: 'Ch. 25 RCC Concrete' },
    { id: 26, label: 'Ch. 26 Steel / Trusses' },
    { id: 27, label: 'Ch. 27 Brickwork' },
    { id: 28, label: 'Ch. 28 Stone Masonry' },
    { id: 32, label: 'Ch. 32 Plastering' },
    { id: 33, label: 'Ch. 33 Flooring' },
    { id: 35, label: 'Ch. 35 Painting' },
    { id: 3, label: 'Ch. 03 Road GSB' },
    { id: 4, label: 'Ch. 04 Bituminous' },
    { id: 52, label: 'Ch. 52 Waterproofing' },
  ];

  const filteredItems = SSR_MASTER_ITEMS.filter((item) => {
    const matchesSearch =
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chapterName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChapter = selectedChapter === 'ALL' || item.chapterNumber === selectedChapter;

    return matchesSearch && matchesChapter;
  });

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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
              Maharashtra PWD Schedule of Rates
            </span>
            <h2 className="text-xl font-bold text-[#0B1F3A]">SSR Master Item Catalog ({facesheet.ssrYear})</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse, search, and preview live lead-adjusted unit rates across 2,000+ official schedule specifications with inline take-off.
            </p>
          </div>
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#F4762A]" />
            <span>+ Add Custom Non-SSR Item</span>
          </button>
        </div>

        {/* Search Bar & Chapter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by SSR item code (e.g. 21.02, 25.50, 26.33), keyword or specification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B1F3A] outline-none shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChapter(ch.id as any)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedChapter === ch.id
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
          <span>Showing {filteredItems.length} matching schedule items</span>
          <span>Area Surcharge: +{facesheet.areaSurchargePercent}% | SCADA: {facesheet.scadaDeductionActive ? 'Active' : 'Off'}</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredItems.map((item) => {
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
                    ? 'border-[#F4762A] ring-1 ring-[#F4762A] shadow-md'
                    : 'border-slate-200 hover:border-[#F4762A] hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Item Details */}
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#0B1F3A] text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                        Item {item.itemCode}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        Ch. {item.chapterNumber}: {item.chapterName}
                      </span>
                      {alreadyInEstimate && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                          IN ESTIMATE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-0.5">{item.description}</p>
                    
                    {/* Material Consumption Factors preview tag */}
                    {Object.keys(item.defaultCF).length > 0 && (
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 pt-1">
                        <Layers className="w-3 h-3 text-[#F4762A]" />
                        <span>
                          Constituent Materials: {Object.entries(item.defaultCF).map(([k, v]) => `${k} (${v})`).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rate Card & Actions */}
                  <div className="flex items-center space-x-3 shrink-0 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Basic SSR Rate</div>
                      <div className="text-xs font-semibold text-slate-600 tabular-nums-force">
                        ₹{item.baseRate.toFixed(2)} / {item.unit}
                      </div>
                    </div>

                    <div className="text-right pl-3 border-l border-slate-200">
                      <div className="text-[10px] text-[#F4762A] uppercase font-bold flex items-center justify-end space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Live Lead Rate</span>
                      </div>
                      <div className="text-sm font-bold text-[#0B1F3A] tabular-nums-force">
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
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Ruler className="w-3.5 h-3.5 text-[#F4762A]" />
                      <span className="hidden sm:inline">Take-off</span>
                      {isTakeoffOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                    </button>

                    {/* Action 2: Direct Fast Add */}
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F4762A] hover:bg-[#D65F14] text-white hover:scale-105 active:scale-95'
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
                          <span>+ Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Quick Take-off Form */}
                {isTakeoffOpen && (
                  <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50/80 p-3 rounded-lg space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                      <span className="flex items-center space-x-1.5">
                        <Ruler className="w-4 h-4 text-[#F4762A]" />
                        <span>Inline Dimensional Take-Off (L × B × D/H)</span>
                      </span>
                      <span className="text-[11px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                        Computed Take-Off: <strong className="text-emerald-700 font-mono text-xs">{(takeoffData.multiplier * takeoffData.length * takeoffData.breadth * takeoffData.depth).toFixed(3)} {item.unit}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Detail Label:</label>
                        <input
                          type="text"
                          value={takeoffData.label}
                          onChange={(e) => setTakeoffData({ ...takeoffData, label: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#0B1F3A]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Floor Level:</label>
                        <select
                          value={takeoffData.floorTag}
                          onChange={(e) => setTakeoffData({ ...takeoffData, floorTag: e.target.value as FloorTag })}
                          className="w-full px-1.5 py-1.5 border border-slate-300 rounded text-xs bg-white font-semibold"
                        >
                          <option value="GF">Ground Floor</option>
                          <option value="1F">1st Floor (+0.5%)</option>
                          <option value="2F">2nd Floor (+1.0%)</option>
                          <option value="3F">3rd Floor (+1.5%)</option>
                          <option value="4F">4th Floor (+2.0%)</option>
                          <option value="Basement">Basement</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Nos (Count):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.multiplier}
                          onChange={(e) => setTakeoffData({ ...takeoffData, multiplier: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white text-right font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Length (L):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.length}
                          onChange={(e) => setTakeoffData({ ...takeoffData, length: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white text-right font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Breadth (B):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.breadth}
                          onChange={(e) => setTakeoffData({ ...takeoffData, breadth: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white text-right font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] text-slate-500 font-semibold">Depth / Height (D/H):</label>
                        <input
                          type="number"
                          step="any"
                          value={takeoffData.depth}
                          onChange={(e) => setTakeoffData({ ...takeoffData, depth: parseFloat(e.target.value) || 0 })}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-xs bg-white text-right font-mono"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setExpandedTakeoffId(null)}
                          className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddWithDimensions(item)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            Add with Dimensions ({(takeoffData.multiplier * takeoffData.length * takeoffData.breadth * takeoffData.depth).toFixed(2)} {item.unit})
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
      </div>

      {/* Custom Non-SSR Item Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0B1F3A]">Create Custom Non-SSR Work Item</h3>
              <p className="text-xs text-slate-500">Add proprietary or site-specific work not covered in standard SSR.</p>
            </div>

            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Item Code</label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Technical Description</label>
                <textarea
                  rows={3}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Providing and applying specialized..."
                  className="w-full text-xs p-2 rounded border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measurement</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-slate-50"
                  >
                    <option value="Cu.M">Cu.M (Volume)</option>
                    <option value="Sqm">Sqm (Area)</option>
                    <option value="Rmt">Rmt (Running Length)</option>
                    <option value="Nos">Nos (Count)</option>
                    <option value="MT">MT (Weight)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Unit Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-slate-300 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#0B1F3A] hover:bg-[#14335C] text-white font-bold rounded shadow"
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
