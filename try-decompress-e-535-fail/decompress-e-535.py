import zlib
import sys
from pathlib import Path

obj_path = Path("e-535.zip")
compressed_data = obj_path.read_bytes()

decompressed = zlib.decompress(compressed_data)
