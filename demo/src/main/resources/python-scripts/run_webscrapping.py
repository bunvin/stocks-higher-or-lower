import schedule
import time
import os

def run_script():
    os.system('python webscraping-yahoo-finance-stocks-data.py')

# Schedule the script to run every day at midnight (00:00)
schedule.every().day.at("23:06").do(run_script)

while True:
    schedule.run_pending()
    time.sleep(60)  # Check every minute