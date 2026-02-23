import Foundation
import PDFKit

let args = ProcessInfo.processInfo.arguments
if args.count < 2 {
    print("Usage: extract.swift <pdf_path>")
    exit(1)
}

let path = args[1]
let url = URL(fileURLWithPath: path)

if let pdf = PDFDocument(url: url) {
    var fullText = ""
    for i in 0..<pdf.pageCount {
        if let page = pdf.page(at: i), let text = page.string {
            fullText += text + "\n"
        }
    }
    print(fullText)
} else {
    print("Could not open PDF")
    exit(1)
}
