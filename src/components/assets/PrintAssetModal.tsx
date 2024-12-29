import React, { useEffect, useRef } from 'react';
import { Printer } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Asset } from '../../types/asset';
import { useBranchInfo } from '../../hooks/auth/useBranchInfo';

interface PrintAssetModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function PrintAssetModal({ asset, onClose }: PrintAssetModalProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const { currentBranch } = useBranchInfo();

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, asset.barcode, {
        format: "CODE128",
        width: 1.2,
        height: 25,
        displayValue: true,
        fontSize: 9,
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 1,
        margin: 0
      });
    }
  }, [asset.barcode]);

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const mainCategoryName = asset.sub_category?.category?.name || 'غير محدد';
    const subCategoryName = asset.sub_category?.name || 'غير محدد';
    const branchName = currentBranch?.name || 'غير محدد';

    const html = `
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <title>طباعة ملصق الأصل - ${asset.name}</title>
          <style>
            @page {
              size: 50mm 25mm;
              margin: 0;
            }
            @media print {
              body {
                width: 50mm;
                height: 25mm;
                margin: 0;
                padding: 0;
              }
              .label-content {
                transform: scale(1);
                transform-origin: center;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              direction: rtl;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 50mm;
              height: 25mm;
              box-sizing: border-box;
              background: white;
            }
            .label-content {
              width: 100%;
              text-align: center;
              padding: 1mm;
            }
            .barcode-container {
              margin-bottom: 0.5mm;
              transform: scale(0.95);
            }
            .barcode-container svg {
              max-width: 95%;
              height: auto;
            }
            .name {
              font-weight: 900;
              margin-bottom: 0.5mm;
              font-size: 7pt;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 0 1mm;
            }
            .details {
              font-size: 6pt;
              font-weight: 600;
              color: #333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 0 1mm;
            }
            .branch {
              font-size: 5pt;
              color: #666;
              margin-top: 0.5mm;
            }
          </style>
        </head>
        <body>
          <div class="label-content">
            <div class="barcode-container">
              ${barcodeRef.current?.outerHTML || ''}
            </div>
            <div class="name">${asset.name}</div>
            <div class="details">
              ${mainCategoryName} - ${subCategoryName}
            </div>
            <div class="branch">${branchName}</div>
          </div>
        </body>
      </html>
    `;

    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(html);
    iframe.contentWindow?.document.close();

    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    };
  };

  return (
    <Modal title="طباعة ملصق الأصل" onClose={onClose}>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">معاينة الملصق</h3>
          <div className="border border-gray-200 rounded bg-white" style={{ width: '200px', height: '100px', padding: '4px' }}>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-1 transform scale-95">
                <svg ref={barcodeRef}></svg>
              </div>
              <div className="font-black text-xs mb-0.5 px-1 w-full truncate">{asset.name}</div>
              <div className="text-[10px] font-semibold text-gray-700 px-1 w-full truncate">
                {asset.sub_category?.category?.name || 'غير محدد'} - {asset.sub_category?.name || 'غير محدد'}
              </div>
              <div className="text-[8px] text-gray-500 px-1 w-full truncate">
                {currentBranch?.name || 'غير محدد'}
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            حجم الملصق: 50mm × 25mm
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handlePrint} icon={Printer}>
            طباعة الملصق
          </Button>
        </div>
      </div>
    </Modal>
  );
}