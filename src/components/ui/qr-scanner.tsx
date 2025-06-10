'use client'

import { useEffect } from 'react'
import {
  Html5QrcodeScanner,
  QrCodeSuccessCallback,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode'
import { Button } from './button'

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void
  onClose: () => void
  scanType: 'qr' | 'barcode'
}

const qrCodeRegionId = 'qr-code-scanner-region'

export const QrScanner = ({
  onScanSuccess,
  onClose,
  scanType,
}: QrScannerProps) => {
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null

    const handleSuccess: QrCodeSuccessCallback = (
      decodedText,
      _decodedResult
    ) => {
      // Stop scanning and pass the result back
      if (scanner) {
        scanner.clear().catch(console.error)
      }
      onScanSuccess(decodedText)
    }

    const handleError = (_errorMessage: string) => {
      // Errors can be frequent (e.g., no QR code in view), so we can ignore them for a cleaner console
      // console.error(`QR Code scan error: ${errorMessage}`);
    }

    const config =
      scanType === 'qr'
        ? {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          }
        : {
            fps: 10,
            rememberLastUsedCamera: true,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_93,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.ITF,
              Html5QrcodeSupportedFormats.CODABAR,
            ],
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true,
            },
          }

    // Creates a new scanner
    scanner = new Html5QrcodeScanner(
      qrCodeRegionId,
      config,
      /* verbose= */ false
    )

    // Start scanning
    scanner.render(handleSuccess, handleError)

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      if (scanner) {
        // It's important to check if the scanner element is still in the DOM
        const scannerElement = document.getElementById(qrCodeRegionId)
        if (scannerElement) {
          scanner.clear().catch(console.error)
        }
      }
    }
  }, [onScanSuccess, scanType])

  const title =
    scanType === 'qr' ? 'Escanear Código QR' : 'Escanear Código de Barras'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
        <div id={qrCodeRegionId} className="w-full" />
        <Button
          variant="destructive"
          onClick={onClose}
          className="w-full mt-4"
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
} 