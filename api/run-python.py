import subprocess

def handler(request):
    # Path to the Python script you want to run
    script_path = 'src/script.py'

    # Running the script and capturing output
    result = subprocess.run(['python3', script_path, 'Saurabh'], stdout=subprocess.PIPE)

    # Return the result as JSON
    return {
        "statusCode": 200,
        "body": result.stdout.decode('utf-8')
    }
