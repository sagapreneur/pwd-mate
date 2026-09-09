import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { Printer, CheckCircle2, FileText, Stamp, Award, ShieldCheck } from 'lucide-react';

type MarathiDocType =
  | 'COVER_LETTER'
  | 'TECH_SANCTION'
  | 'WORK_ORDER'
  | 'GRAM_PANCHAYAT_NOC'
  | 'BOUNDARY_CERT'
  | 'GENERAL_REPORT'
  | 'CHECKLIST'
  | 'APPENDIX_B'
  | 'NON_SUBMERGENCE';

export const MarathiDocsModule: React.FC = () => {
  const { facesheet, calculationRollup, stamps } = useEstimatorStore();
  const [selectedDoc, setSelectedDoc] = useState<MarathiDocType>('COVER_LETTER');

  // Work Order Form State
  const [contractorName, setContractorName] = useState('मे. समर्थ इन्फ्रास्ट्रक्चर प्रा. लि.');
  const [contractorAddr, setContractorAddr] = useState('प्लॉट नं. १५, शिवाजी चौक, वर्धा');
  const [tenderOutwardNo, setTenderOutwardNo] = useState('जा.क्र./सा.बां./निविदा/२०२६/४८२');
  const [workDurationMonths, setWorkDurationMonths] = useState('३ महिने');
  const [workStartDate, setWorkStartDate] = useState('०१/११/२०२६');
  const [workEndDate, setWorkEndDate] = useState('३१/०१/२०२७');

  // Gram Panchayat / Boundary State
  const [villageName, setVillageName] = useState('वर्धा');
  const [talukaName, setTalukaName] = useState('वर्धा');
  const [districtName, setDistrictName] = useState('वर्धा');
  const [schemeName, setSchemeName] = useState('२५१५ ग्रामविकास कार्यक्रम / पोलीस पायाभूत सुविधा');
  const [tharavNo, setTharavNo] = useState('१४/२०२६');
  const [tharavDate, setTharavDate] = useState('१२/०८/२०२६');
  const [gatNo, setGatNo] = useState('सर्व्हे क्र. ८२/१अ');
  const [boundEast, setBoundEast] = useState('मुख्य रस्ता (PWD Road)');
  const [boundWest, setBoundWest] = useState('शासकीय खुली जागा');
  const [boundNorth, setBoundNorth] = useState('पोलीस अधीक्षक कार्यालय सीमा');
  const [boundSouth, setBoundSouth] = useState('कर्मचारी निवासस्थाने');

  const seStamp = stamps.find((s) => s.role === 'SE');
  const sdeStamp = stamps.find((s) => s.role === 'SDE');
  const eeStamp = stamps.find((s) => s.role === 'EE');

  return (
    <div className="space-y-6 font-devanagari">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between no-print">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider font-sans">
            Statutory Devanagari Administrative Suite
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">महाराष्ट्र सार्वजनिक बांधकाम विभाग — अधिकृत मराठी दस्तऐवज</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            तांत्रिक मंजुरी आदेश, कार्यारंभ आदेश, ग्रामपंचायत ना-हरकत, हद्द प्रमाणपत्र व तपासणी सूची.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-semibold shadow-sm"
        >
          <Printer className="w-4 h-4 text-[#F4762A]" />
          <span className="font-sans">Print Document / Save PDF</span>
        </button>
      </div>

      {/* Document Selector Tabs */}
      <div className="flex flex-wrap gap-2 no-print">
        {[
          { id: 'COVER_LETTER', label: '१. कव्हरिंग पत्र' },
          { id: 'TECH_SANCTION', label: '२. तांत्रिक मंजुरी आदेश (TS Order)' },
          { id: 'WORK_ORDER', label: '३. कार्यारंभ आदेश (Work Order)' },
          { id: 'GRAM_PANCHAYAT_NOC', label: '४. ग्रामपंचायत ना-हरकत (NOC)' },
          { id: 'BOUNDARY_CERT', label: '५. हद्द प्रमाणपत्र (Site Boundary)' },
          { id: 'GENERAL_REPORT', label: '६. साधारण अहवाल' },
          { id: 'CHECKLIST', label: '७. तपासणी सूची (Checklist)' },
          { id: 'APPENDIX_B', label: '८. परिशिष्ट "ब"' },
          { id: 'NON_SUBMERGENCE', label: '९. पूर पातळी प्रमाणपत्र' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedDoc(tab.id as MarathiDocType)}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all ${
              selectedDoc === tab.id
                ? 'bg-[#0B1F3A] text-white shadow-sm ring-2 ring-[#F4762A]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Controls Bar for Work Order & NOC */}
      {selectedDoc === 'WORK_ORDER' && (
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 no-print space-y-3 text-xs">
          <div className="font-bold text-[#0B1F3A] flex items-center space-x-1.5 font-sans">
            <Award className="w-4 h-4 text-[#F4762A]" />
            <span>कार्यारंभ आदेश तपशील (Work Order Settings):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">कंत्राटदाराचे नाव:</label>
              <input
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">कंत्राटदाराचा पत्ता:</label>
              <input
                type="text"
                value={contractorAddr}
                onChange={(e) => setContractorAddr(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">निविदा स्वीकृती जावक क्र.:</label>
              <input
                type="text"
                value={tenderOutwardNo}
                onChange={(e) => setTenderOutwardNo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">कामाची मुदत:</label>
              <input
                type="text"
                value={workDurationMonths}
                onChange={(e) => setWorkDurationMonths(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">काम सुरू दिनांक:</label>
              <input
                type="text"
                value={workStartDate}
                onChange={(e) => setWorkStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">काम पूर्ण दिनांक:</label>
              <input
                type="text"
                value={workEndDate}
                onChange={(e) => setWorkEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {(selectedDoc === 'GRAM_PANCHAYAT_NOC' || selectedDoc === 'BOUNDARY_CERT') && (
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 no-print space-y-3 text-xs">
          <div className="font-bold text-[#0B1F3A] flex items-center space-x-1.5 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#F4762A]" />
            <span>स्थानिक संस्था व जागा तपशील (Site & Panchayat Details):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">गाव / शहर:</label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">तालुका / जिल्हा:</label>
              <input
                type="text"
                value={talukaName}
                onChange={(e) => setTalukaName(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">योजनेचे नाव:</label>
              <input
                type="text"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">गट / सर्व्हे क्र.:</label>
              <input
                type="text"
                value={gatNo}
                onChange={(e) => setGatNo(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">पूर्व सीमा:</label>
              <input
                type="text"
                value={boundEast}
                onChange={(e) => setBoundEast(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">पश्चिम सीमा:</label>
              <input
                type="text"
                value={boundWest}
                onChange={(e) => setBoundWest(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">दक्षिण सीमा:</label>
              <input
                type="text"
                value={boundSouth}
                onChange={(e) => setBoundSouth(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block font-semibold mb-1">उत्तर सीमा:</label>
              <input
                type="text"
                value={boundNorth}
                onChange={(e) => setBoundNorth(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Document Paper Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto space-y-6 text-sm text-slate-800 leading-relaxed min-h-[600px]">
        {/* State Header */}
        <div className="text-center border-b border-slate-200 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            महाराष्ट्र शासन — सार्वजनिक बांधकाम विभाग
          </div>
          <div className="font-bold text-base text-[#0B1F3A]">
            कार्यालय: {facesheet.subDivision}, {facesheet.division}
          </div>
        </div>

        {/* 1. Covering Letter */}
        {selectedDoc === 'COVER_LETTER' && (
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <div>जावक क्रमांक: {facesheet.outwardNo || 'सा.बां./उपवि-१/तांत्रिक/२०२२/_____'}</div>
              <div>दिनांक: {facesheet.letterDate || new Date().toLocaleDateString('en-IN')}</div>
            </div>

            <div className="space-y-1 text-xs">
              <div>प्रति,</div>
              <div className="font-bold text-slate-900">मा. कार्यकारी अभियंता साहेब,</div>
              <div>{facesheet.division}</div>
            </div>

            <div className="pt-2 font-bold text-sm text-center bg-slate-50 p-2 rounded border border-slate-100">
              विषय: {facesheet.nameOfWork} च्या अंदाजपत्रकास तांत्रिक मंजुरी मिळण्याबाबत.
            </div>

            <p className="text-xs text-justify indent-8">
              महोदय,
              <br />
              उपरोक्त विषयांन्वये सविनय सादर करण्यात येते की, <strong>{facesheet.nameOfWork}</strong> या कामाचे अंदाजपत्रक सन <strong>{facesheet.ssrYear}</strong> च्या मंजूर दरसूचीवर आधारित तयार करण्यात आलेले आहे. सदर कामाची एकूण रक्कम <strong>₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}/- ({calculationRollup.formattedLakhs})</strong> इतकी प्रस्तावित आहे.
            </p>

            <p className="text-xs text-justify indent-8">
              सदर अंदाजपत्रकासोबत मोजमाप नोंदवही (Measurement Sheet), दर पृथक्करण (Rate Analysis), रॉयल्टी विवरणपत्र (Schedule B), गुणवत्ता नियंत्रण चाचणी विवरणपत्र (Schedule C), आणि रेखाचित्रे जोडण्यात आलेली आहेत.
            </p>

            <p className="text-xs text-justify indent-8">
              सदर अंदाजपत्रकास प्रशासकीय मान्यता क्रमांक <strong>{facesheet.adminApprovalNo}</strong> दिनांक <strong>{facesheet.adminApprovalDate}</strong> अन्वये प्राप्त झालेली आहे. तरी सदर अंदाजपत्रकास तांत्रिक मंजुरी प्रदान व्हावी ही नम्र विनंती.
            </p>

            <div className="pt-10 flex justify-end">
              <div className="text-center text-xs space-y-1">
                <div className="h-8"></div>
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>{sdeStamp?.designation || 'उपविभागीय अभियंता'}</div>
                <div>{facesheet.subDivision}</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Technical Sanction Order */}
        {selectedDoc === 'TECH_SANCTION' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <div>जावक क्र: {facesheet.techSanctionNo}</div>
              <div>दिनांक: {facesheet.techSanctionDate || new Date().toLocaleDateString('en-IN')}</div>
            </div>

            <div className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              तांत्रिक मंजुरी आदेश (Technical Sanction Order)
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
              <div><strong>कामाचे नाव:</strong> {facesheet.nameOfWork}</div>
              <div><strong>मंजूर रक्कम:</strong> ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}/- ({calculationRollup.formattedLakhs})</div>
              <div><strong>प्रशासकीय मान्यता:</strong> {facesheet.adminApprovalNo} (दिनांक: {facesheet.adminApprovalDate})</div>
              <div><strong>दरसूची वर्ष:</strong> ई-दरसूची {facesheet.ssrYear}</div>
            </div>

            <p className="text-justify font-semibold">
              महाराष्ट्र सार्वजनिक बांधकाम विभाग नियमावलीतील अधिकारांचा वापर करून वरील कामाच्या तपशीलवार अंदाजपत्रकास खालील विहित अटी व शर्तींच्या अधीन राहून तांत्रिक मंजुरी (Technical Sanction) प्रदान करण्यात येत आहे:
            </p>

            <div className="space-y-2 pl-4">
              <div className="flex space-x-2">
                <span className="font-bold">१.</span>
                <span>सदर कामावरील खर्च <strong>{facesheet.fundHead}</strong> या लेखाशीर्षाखाली उपलब्ध अनुदानातून करण्यात यावा.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">२.</span>
                <span>सक्षम प्राधिकाऱ्यांकडून आवश्यक आर्थिक तरतूद (Budget Provision) उपलब्ध झाल्याची खात्री करूनच प्रत्यक्ष काम सुरू करण्यात यावे.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">३.</span>
                <span>मंजूर तांत्रिक रकमेपेक्षा (₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}/-) कोणताही वाढीव खर्च होणार नाही याची काटेकोर दक्षता घेण्यात यावी.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">४.</span>
                <span>साहित्याचे प्रत्यक्ष वाहतूक अंतर (Quarry Lead Distance) कामाच्या ठिकाणी उपविभागीय अभियंत्यांनी पुन्हा तपासून त्याप्रमाणेच देयके पारित करावीत.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">५.</span>
                <span>रॉयल्टी चार्जेस वाळूसाठी रु. २३७.३७/घन मी. व इतर गौणखनिजांसाठी रु. २१६.१८/घन मी. निविदेत समाविष्ट केले असून सक्षम महसूल पावतीशिवाय देयक अदा करू नये.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">६.</span>
                <span>बांधकामामध्ये वापरण्यात येणाऱ्या सिमेंट, स्टील व गिट्टीची गुणवत्ता नियंत्रण चाचणी (MORTH / PWD Handbook Ch. 33) प्रयोगशाळेतून अनिवार्यपणे करून घ्यावी.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">७.</span>
                <span>काम सार्वजनिक जागेवर होत असल्याबाबत ग्रामपंचायत / स्थानिक प्राधिकरणाचे नाहरकत प्रमाणपत्र (NOC) प्राप्त झाल्यानंतरच कार्यारंभ आदेश द्यावा.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">८.</span>
                <span>महाराष्ट्र शासन सार्वजनिक बांधकाम विभागाच्या प्रचलित ई-निविदा कार्यप्रणालीनुसार (e-Tendering) स्पर्धात्मक निविदा मागविण्यात याव्यात.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">९.</span>
                <span>प्रत्येक मोजमाप नियमितपणे अधिकृत मोजमाप नोंदवहीत (Measurement Book - MB) नोंदवून कनिष्ठ/शाखा अभियंत्यांनी स्वाक्षरी करावी.</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">१०.</span>
                <span>सदर काम विहित कालावधीत उत्कृष्ट दर्जाचे व दोषदायित्व कालावधी (DLP) च्या अटींसह पूर्ण करण्याची जबाबदारी संबंधित क्षेत्रीय अधिकाऱ्यांची राहील.</span>
              </div>
            </div>

            <div className="pt-8 flex justify-between">
              <div className="text-center text-xs">
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>{facesheet.subDivision}</div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold">{eeStamp?.name || 'कार्यकारी अभियंता'}</div>
                <div>{facesheet.division}</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Work Order (कार्यारंभ आदेश) */}
        {selectedDoc === 'WORK_ORDER' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <div>जावक क्र: {tenderOutwardNo}</div>
              <div>दिनांक: {workStartDate}</div>
            </div>

            <div className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              कार्यारंभ आदेश (Work Order / निविदा स्वीकृती आदेश)
            </div>

            <div className="space-y-1">
              <div>प्रति,</div>
              <div className="font-bold text-slate-900 text-sm">{contractorName}</div>
              <div>{contractorAddr}</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-semibold">
              विषय: कार्यारंभ आदेश — {facesheet.nameOfWork}.
            </div>

            <p className="text-justify indent-6">
              महोदय,
              <br />
              आपण उपरोक्त कामासाठी सादर केलेली निविदा या कार्यालयाने मान्य केली असून, सक्षम प्राधिकाऱ्यांच्या मान्यतेनुसार आपणास हे कार्यारंभ आदेश देण्यात येत आहे. कामाचा तपशील खालीलप्रमाणे आहे:
            </p>

            <table className="w-full border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 bg-slate-50 font-bold w-1/3">१. कामाचे नाव:</td>
                  <td className="p-2">{facesheet.nameOfWork}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 bg-slate-50 font-bold">२. मंजूर तांत्रिक रक्कम:</td>
                  <td className="p-2 font-bold">₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}/-</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 bg-slate-50 font-bold">३. निविदा स्वीकृत रक्कम:</td>
                  <td className="p-2 font-bold text-emerald-800">₹{calculationRollup.scheduleA_costOfWork.toLocaleString('en-IN')}/- ({calculationRollup.formattedLakhs})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 bg-slate-50 font-bold">४. कामाची मुदत:</td>
                  <td className="p-2">{workDurationMonths} (दिनांक {workStartDate} ते {workEndDate})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 bg-slate-50 font-bold">५. सुरक्षा अनामत रक्कम (SD):</td>
                  <td className="p-2">नियमानुसार २.५% देयकातून कपात व २.५% मुदत ठेव पावती (FDR)</td>
                </tr>
              </tbody>
            </table>

            <p className="text-justify indent-6">
              तरी आपण सदर आदेश प्राप्त झाल्यापासून ७ दिवसांच्या आत विहित मुद्रांकावर (Stamp Paper) करारनामा पूर्ण करून शाखा अभियंत्यांशी संपर्क साधून प्रत्यक्ष कामास त्वरित सुरुवात करावी. कामाचा दर्जा सार्वजनिक बांधकाम विभागाच्या मानकांनुसार असणे बंधनकारक आहे.
            </p>

            <div className="pt-8 flex justify-between">
              <div className="text-center text-xs">
                <div className="font-bold">प्रत माहितीस्तव:</div>
                <div className="text-slate-500">१. शाखा अभियंता, सा.बां.</div>
                <div className="text-slate-500">२. लेखापाल, सा.बां. विभाग</div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold">{eeStamp?.name || 'कार्यकारी अभियंता'}</div>
                <div>{facesheet.division}</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Gram Panchayat NOC */}
        {selectedDoc === 'GRAM_PANCHAYAT_NOC' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <div>ग्रामपंचायत जावक क्र: {tharavNo}</div>
              <div>दिनांक: {tharavDate}</div>
            </div>

            <div className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              ना-हरकत प्रमाणपत्र (No Objection Certificate - NOC)
            </div>

            <p className="text-justify indent-6">
              दाखला देण्यात येतो की, मौजे <strong>{villageName}</strong>, ता. <strong>{talukaName}</strong>, जि. <strong>{districtName}</strong> येथे <strong>{schemeName}</strong> अंतर्गत मंजूर असलेले <strong>"{facesheet.nameOfWork}"</strong> हे बांधकाम सार्वजनिक हिताचे आहे.
            </p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
              <div>१. सदर बांधकामाची जागा (गट क्र. {gatNo}) ग्रामपंचायत / शासकीय मालकीची असून त्यावर कोणत्याही व्यक्ती वा संस्थेची खाजगी मालकी वा वाद नाही.</div>
              <div>२. ग्रामपंचायत मासिक सभा ठराव क्र. <strong>{tharavNo}</strong>, दिनांक <strong>{tharavDate}</strong> अन्वये सदर कामास सर्वानुमते मंजुरी देण्यात आलेली आहे.</div>
              <div>३. सार्वजनिक बांधकाम विभागामार्फत सदर बांधकाम करण्यास या ग्रामपंचायतीची कोणतीही हरकत नाही.</div>
            </div>

            <p className="text-justify indent-6">
              करीता सार्वजनिक बांधकाम विभागास अंदाजपत्रक व तांत्रिक मान्यतेसाठी हे ना-हरकत प्रमाणपत्र देण्यात येत आहे.
            </p>

            <div className="pt-12 flex justify-between">
              <div className="text-center text-xs">
                <div className="font-bold">ग्रामसेवक / ग्रामविकास अधिकारी</div>
                <div>ग्रामपंचायत {villageName}</div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold">सरपंच</div>
                <div>ग्रामपंचायत {villageName}</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Demarcation Certificate (हद्द प्रमाणपत्र) */}
        {selectedDoc === 'BOUNDARY_CERT' && (
          <div className="space-y-4 text-xs">
            <div className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              हद्द व जागा निश्चिती प्रमाणपत्र (Demarcation & Boundary Certificate)
            </div>

            <p className="text-justify indent-6">
              प्रमाणित करण्यात येते की, <strong>{facesheet.nameOfWork}</strong> या नियोजित बांधकामाची जागा प्रत्यक्ष स्थळ पाहणी करून निश्चित करण्यात आलेली आहे. सदर जागेवर कोणतेही अतिक्रमण नसून हद्दीच्या चतुःसीमा खालीलप्रमाणे विहित करण्यात आलेल्या आहेत:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-slate-700">पूर्व दिशा:</span>
                <span>{boundEast}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-slate-700">पश्चिम दिशा:</span>
                <span>{boundWest}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-slate-700">दक्षिण दिशा:</span>
                <span>{boundSouth}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">उत्तर दिशा:</span>
                <span>{boundNorth}</span>
              </div>
            </div>

            <p className="text-justify indent-6">
              सदर जागेचा भूमापन / सिटी सर्व्हे / गट क्र. <strong>{gatNo}</strong> असा असून प्रस्तावित काम पूर्णपणे विहित शासकीय जागेतच करण्यात येईल व कोणतीही कायदेशीर अडचण उद्भवणार नाही याची खात्री करण्यात आली आहे.
            </p>

            <div className="pt-12 flex justify-between">
              <div className="text-center text-xs">
                <div className="font-bold">{seStamp?.name || 'शाखा अभियंता'}</div>
                <div>शाखा अभियंता, सा.बां.</div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>उपविभागीय अभियंता, सा.बां.</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. General Report */}
        {selectedDoc === 'GENERAL_REPORT' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              साधारण अहवाल (General Report / Project Narrative)
            </h3>
            <p className="text-justify indent-6">
              <strong>१. कामाची आवश्यकता (Necessity):</strong> {facesheet.necessity}
            </p>
            <p className="text-justify indent-6">
              <strong>२. जागेची पाहणी (Site Inspection):</strong> प्रस्तावित कामाच्या जागेची प्रत्यक्ष पाहणी शाखा अभियंता व उपविभागीय अभियंता यांच्याकडून करण्यात आलेली असून जागा पूर्णपणे समपातळीत व शासकीय ताब्यात आहे.
            </p>
            <p className="text-justify indent-6">
              <strong>३. दरसूचीचा आधार (Basis of Rates):</strong> सदर अंदाजपत्रकातील बाबींचे दर सार्वजनिक बांधकाम विभाग, नागपूर/अमरावती/नाशिक प्रादेशिक विभागाच्या सन {facesheet.ssrYear} च्या ई-दरसूचीवर आधारित आहेत.
            </p>
            <p className="text-justify indent-6">
              <strong>४. वाहतूक अंतर (Lead Distances):</strong> स्थानिक खाणींमधून (Quarries) दगड, वाळू व गिट्टीच्या वाहतुकीसाठी सार्वजनिक बांधकाम विभागाच्या Statement C-1 नुसार किमान वाहतूक अंतर ग्राह्य धरण्यात आलेले आहे.
            </p>
            <p className="text-justify indent-6">
              <strong>५. अंदाजपत्रकाची रक्कम (Estimate Cost):</strong> प्रस्तुत अंदाजपत्रक एकूण ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}/- ({calculationRollup.formattedLakhs}) रकमेचे तयार करण्यात आलेले आहे.
            </p>
            <div className="pt-8 flex justify-end">
              <div className="text-center text-xs space-y-1">
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>उपविभागीय अभियंता, {facesheet.subDivision}</div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Checklist */}
        {selectedDoc === 'CHECKLIST' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              अंदाजपत्रक तांत्रिक तपासणी सूची (Technical Scrutiny Checklist)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-1.5 w-12 text-center">अ.क्र.</th>
                  <th className="border border-slate-300 p-1.5 text-left">तपासणीचा मुद्दा</th>
                  <th className="border border-slate-300 p-1.5 w-36 text-center">पूर्तता / शेरा</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="text-center">१</td>
                  <td>कामाची जागा शासकीय मालकीची असून जागेचा वाद नाही काय?</td>
                  <td className="text-center text-emerald-700 font-bold">होय (प्रमाणपत्र संलग्न)</td>
                </tr>
                <tr>
                  <td className="text-center">२</td>
                  <td>दरसूची {facesheet.ssrYear} चे दर अचूकपणे लागू केले आहेत काय?</td>
                  <td className="text-center text-emerald-700 font-bold">होय (ई-दरसूचीनुसार)</td>
                </tr>
                <tr>
                  <td className="text-center">३</td>
                  <td>वाहतूक अंतराचे विवरणपत्र (Lead Statement B) योग्य आहे काय?</td>
                  <td className="text-center text-emerald-700 font-bold">होय (प्रमाणित)</td>
                </tr>
                <tr>
                  <td className="text-center">४</td>
                  <td>मोजमापाची आकडेमोड प्रत्यक्ष मोजणीप्रमाणे अचूक आहे काय?</td>
                  <td className="text-center text-emerald-700 font-bold">होय (तपासणीकृत)</td>
                </tr>
                <tr>
                  <td className="text-center">५</td>
                  <td>रॉयल्टी व गुणवत्ता चाचणी खर्चाची अचूक तरतूद करण्यात आली आहे काय?</td>
                  <td className="text-center text-emerald-700 font-bold">होय (Schedule B & C)</td>
                </tr>
                <tr>
                  <td className="text-center">६</td>
                  <td>जीएसटी १८% व कामगार विमा उपकर १% योग्य रीतीने लागू केला आहे काय?</td>
                  <td className="text-center text-emerald-700 font-bold">होय (नियमांनुसार)</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-8 flex justify-end">
              <div className="text-center text-xs space-y-1">
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>उपविभागीय अभियंता, {facesheet.subDivision}</div>
              </div>
            </div>
          </div>
        )}

        {/* 8. Appendix B */}
        {selectedDoc === 'APPENDIX_B' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              परिशिष्ट "ब" प्रमाणपत्र (Appendix B Certificate)
            </h3>
            <p className="text-justify indent-6">
              प्रमाणित करण्यात येते की, {facesheet.nameOfWork} या कामासाठी प्रस्तावित करण्यात आलेली सर्व बांधकामाची सामग्री (सिमेंट, वाळू, गिट्टी, स्टील व वीटा) सार्वजनिक बांधकाम विभागाच्या विहित मानकांनुसार (IS Standards) तपासली जाईल. प्रयोगशाळा चाचणी अहवाल समाधानकारक असल्याशिवाय सदर सामग्री कामावर वापरण्यास अनुमती दिली जाणार नाही.
            </p>
            <div className="pt-12 flex justify-between">
              <div className="text-center text-xs">
                <div className="font-bold">{seStamp?.name || 'शाखा अभियंता'}</div>
                <div>शाखा अभियंता</div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>उपविभागीय अभियंता</div>
              </div>
            </div>
          </div>
        )}

        {/* 9. Non-Submergence */}
        {selectedDoc === 'NON_SUBMERGENCE' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-center font-bold text-base text-[#0B1F3A] border-b pb-2">
              पूर पातळी प्रमाणपत्र (Non-Submergence Certificate)
            </h3>
            <p className="text-justify indent-6">
              प्रमाणित करण्यात येते की, {facesheet.nameOfWork} चे नियोजित बांधकाम पूर रेषेच्या (High Flood Level - HFL) व सुरक्षित पाण्याच्या पातळीच्या वर आहे. या जागेवर पावसाळ्यात किंवा पुरामुळे पाणी साचून इमारतीस वा संरचनेस कोणताही धोका निर्माण होणार नाही, याची प्रत्यक्ष साइट पाहणी करून खात्री करण्यात आलेली आहे.
            </p>
            <div className="pt-12 flex justify-between">
              <div className="text-center text-xs">
                <div className="font-bold">{seStamp?.name || 'शाखा अभियंता'}</div>
                <div>शाखा अभियंता</div>
              </div>
              <div className="text-center text-xs">
                <div className="font-bold">{sdeStamp?.name || 'उपविभागीय अभियंता'}</div>
                <div>उपविभागीय अभियंता</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
