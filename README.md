# Sec-my-Docs

Transform potentially risky PDFs, office documents, or images into secure PDFs.

Here's how Sec-my-Docs(SMD) operates: You submit a document that might be untrustworthy. In a sandbox(Docker Container), SMD transforms the document into a PDF. Next, it converts the PDF into raw pixel data, creating a massive array of RGB color values for each page. Then, SMD reconstructs the pixel data back into a PDF.

Sec-my-Docs can convert these types of document into safe PDFs:

- PDF (`.pdf`)
- Microsoft Word (`.docx`, `.doc`)
- Microsoft PowerPoint (`.pptx`, `.ppt`)
- Microsoft Excel (`.xlsx`, `.xls`)
- ODF Text (`.odt`)
- ODF Spreadsheet (`.ods`)
- ODF Presentation (`.odp`)
- ODF Graphics (`.odg`)
- EPUB (`.epub`)
- SVG (`.svg`)
- PNG (`.png`)
- Jpeg (`.jpg`, `.jpeg`)
- other image formats (`.gif`, `.bmp`, `.pnm`, `.pbm`, `.ppm`)

Sec-my-Docs is inspired by [Qubes trusted PDF](https://blog.invisiblethings.org/2013/02/21/converting-untrusted-pdfs-into-trusted.html), but is designed to work on operating systems other than Qubes. Instead of using virtual machines, it employs Docker containers as isolated environments.