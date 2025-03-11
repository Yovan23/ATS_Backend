export const VideoFileTypes = {
    MP4: ".mp4",
    AVI: ".avi",
    MOV: ".mov",
    WMV: ".wmv",
    WebM: ".webm",
  };
  
  export const ImageFileTypes = {
    JPG: ".jpg",
    PNG: ".png",
    JPEG: ".jpeg",
  };
  
  export const DocumentFileTypes = {
    PDF: ".pdf",
    DOC: ".doc",
    DOCX: ".docx",
    TXT: ".txt",
    PPT: ".ppt",
    PPTX: ".pptx",
    XLS: ".xls",
    XLSX: ".xlsx",
    CSV: ".csv",
  };
  
  export const ArchiveFileTypes = {
    RAR: ".rar",
    "7Z": ".7z",
    TAR: ".tar",
    GZ: ".gz",
    BZ2: ".bz2",
  };
  
  export const AllFileTypes = {
    ...ImageFileTypes,
    ...VideoFileTypes,
  };
  