#!/usr/bin/env python3
import sys
import os
import io
import json
import argparse
from pypdf import PdfReader, PdfWriter
from PIL import Image

def compress_pdf(input_path, output_path, level='recommended'):
    """
    Compress a PDF file with genuine image re-encoding, content stream compression,
    and object deduplication using pypdf and Pillow.
    """
    if not os.path.exists(input_path):
        return {"success": False, "error": f"Input file not found: {input_path}"}

    orig_size = os.path.getsize(input_path)

    # Compression profiles:
    # low: high visual quality, mild downscale (max 2400px, quality 80)
    # recommended: balanced quality (max 1600px, quality 65)
    # high: aggressive file size reduction (max 1000px, quality 45)
    profiles = {
        'low': {
            'quality': 80,
            'max_dim': 2400,
            'strip_metadata': False,
        },
        'recommended': {
            'quality': 65,
            'max_dim': 1600,
            'strip_metadata': False,
        },
        'high': {
            'quality': 45,
            'max_dim': 1000,
            'strip_metadata': True,
        }
    }

    config = profiles.get(level.lower(), profiles['recommended'])

    try:
        reader = PdfReader(input_path)
    except Exception as e:
        return {"success": False, "error": f"Failed to read PDF file: {str(e)}"}

    if reader.is_encrypted:
        try:
            decrypted = reader.decrypt("")
            if decrypted == 0:
                return {"success": False, "error": "This PDF is password-protected. Please unlock it before compressing."}
        except Exception:
            return {"success": False, "error": "This PDF is password-protected or encrypted."}

    num_pages = len(reader.pages)
    if num_pages == 0:
        return {"success": False, "error": "The PDF file has no pages."}

    writer = PdfWriter()

    # Transfer pages to writer
    for page in reader.pages:
        writer.add_page(page)

    # Copy metadata if not stripping
    if not config['strip_metadata'] and reader.metadata:
        try:
            writer.add_metadata(reader.metadata)
        except Exception:
            pass

    total_images_optimized = 0

    # Image recompression and stream compression
    for page in writer.pages:
        try:
            for img_obj in page.images:
                try:
                    pil_img = img_obj.image
                    orig_w, orig_h = pil_img.size
                    max_d = config['max_dim']
                    needs_downscale = orig_w > max_d or orig_h > max_d

                    if needs_downscale:
                        pil_img.thumbnail((max_d, max_d), Image.Resampling.LANCZOS)

                    orig_data_len = len(img_obj.data) if hasattr(img_obj, 'data') and img_obj.data else 0

                    is_alpha = (
                        pil_img.mode in ("RGBA", "LA") or
                        (pil_img.mode == "P" and "transparency" in pil_img.info)
                    )

                    if is_alpha:
                        # Test if recompressed PNG is smaller
                        test_buf = io.BytesIO()
                        pil_img.save(test_buf, format="PNG", optimize=True)
                        if orig_data_len == 0 or test_buf.tell() < orig_data_len or needs_downscale:
                            img_obj.replace(pil_img, format="PNG", optimize=True)
                            total_images_optimized += 1
                    else:
                        if pil_img.mode != "RGB":
                            pil_img = pil_img.convert("RGB")
                        test_buf = io.BytesIO()
                        pil_img.save(test_buf, format="JPEG", quality=config['quality'])
                        if orig_data_len == 0 or test_buf.tell() < orig_data_len or needs_downscale:
                            img_obj.replace(pil_img, quality=config['quality'])
                            total_images_optimized += 1
                except Exception:
                    pass
        except Exception:
            pass

        # Compress content streams with FlateDecode
        try:
            page.compress_content_streams()
        except Exception:
            pass

    # Deduplicate objects
    try:
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    except Exception:
        pass

    # Write output PDF
    try:
        with open(output_path, 'wb') as f:
            writer.write(f)
    except Exception as e:
        return {"success": False, "error": f"Failed to write compressed PDF: {str(e)}"}

    comp_size = os.path.getsize(output_path)

    # Ensure output is never larger than input
    if comp_size > orig_size:
        import shutil
        shutil.copyfile(input_path, output_path)
        comp_size = orig_size

    saved_bytes = max(0, orig_size - comp_size)
    ratio = round((saved_bytes / orig_size) * 100, 2) if orig_size > 0 else 0.0

    return {
        "success": True,
        "originalSize": orig_size,
        "compressedSize": comp_size,
        "savedSize": saved_bytes,
        "compressionRatio": ratio,
        "pagesCount": num_pages,
        "imagesOptimized": total_images_optimized,
        "compressionLevel": level.lower()
    }

def main():
    parser = argparse.ArgumentParser(description="Genuine PDF Compressor")
    parser.add_argument("--input", required=True, help="Input PDF path")
    parser.add_argument("--output", required=True, help="Output PDF path")
    parser.add_argument("--level", default="recommended", choices=["low", "recommended", "high"], help="Compression level")

    args = parser.parse_args()

    result = compress_pdf(args.input, args.output, args.level)
    print(json.dumps(result))
    if not result.get("success", False):
        sys.exit(1)

if __name__ == "__main__":
    main()
