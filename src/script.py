import sys

# Accept an argument and print a message
name = sys.argv[1] if len(sys.argv) > 1 else 'World'
print(f'Hello, {name} from Python!')