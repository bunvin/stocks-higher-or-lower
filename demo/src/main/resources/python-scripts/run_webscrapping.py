import schedule
import time
import os

def run_script():
    script_path = 'C:\\Fullstack_apps\\stocks-higher-or-lower\\demo\\src\\main\\resources\\python-scripts\\webscraping-yahoo-finance-stocks-data.py'
    os.system(f'python "{script_path}"')

schedule.every().day.at("23:00").do(run_script)

while True:
    schedule.run_pending()
    time.sleep(60)  # Check every minute