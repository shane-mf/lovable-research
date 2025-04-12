import gzip
import re
import sys
import codecs

def unescape_and_decompress(input_data):
    # Convert unicode escape sequences to bytes
    pattern = r'\\u([0-9a-fA-F]{4})'
    
    def replace_unicode(match):
        hex_val = match.group(1)
        return chr(int(hex_val, 16))
    
    # Replace the unicode escape sequences
    data_string = re.sub(pattern, replace_unicode, input_data)
    
    # Convert to bytes
    data_bytes = data_string.encode('latin1')
    
    # Decompress the gzip data
    try:
        decompressed_data = gzip.decompress(data_bytes)
        return decompressed_data.decode('utf-8', errors='replace')
    except Exception as e:
        return f"Error decompressing data: {e}"

def main():
    if len(sys.argv) > 1:
        # Read from input file
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            input_data = f.read()
            
        # Clean the input - remove quotes and escape characters
        input_data = input_data.strip("'")
        
        result = unescape_and_decompress(input_data)
        
        # Write to output file if specified
        if len(sys.argv) > 2:
            with open(sys.argv[2], 'w', encoding='utf-8') as f:
                f.write(result)
        else:
            print(result)
    else:
        print("Usage: python decompress_gzip.py input_file [output_file]")

if __name__ == "__main__":
    main()