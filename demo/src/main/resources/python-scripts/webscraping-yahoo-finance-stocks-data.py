# %%
import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
import time
from datetime import datetime
import os

# %%
headers = {'user-agent':'Mozilla/5.0 \
            (Windows NT 10.0; Win64; x64) \
            AppleWebKit/537.36 (KHTML, like Gecko) \
            Chrome/84.0.4147.105 Safari/537.36'}

# %%
symbols = [
   'AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'TSLA', 'AVGO', 'BRK-B', 'GOOG' 
]

# %%
all=[]
for symbol in symbols:
    url = 'https://finance.yahoo.com/quote/'+symbol+'/'
    page = requests.get(url,headers=headers)

    profile_url = 'https://finance.yahoo.com/quote/'+symbol+'/profile/'
    description_page = requests.get(profile_url,headers=headers)

    try:
        soup = BeautifulSoup(page.text, 'html.parser')
        
        company_full_name = soup.find('h1', {'class': 'yf-xxbei9'}).text.split('(')
        company_name = company_full_name[0].strip()
        company_symbol = company_full_name[1].replace(')', '').strip()

        price = soup.find('span', {'data-testid': 'qsp-price'}).text
        
        change = soup.find('span', {'data-testid': 'qsp-price-change'}).text  

        fin_streamer = soup.find('fin-streamer', attrs={'data-symbol': {company_symbol}, 'data-field': 'regularMarketVolume'})
        volume = fin_streamer.text.strip()

        date_modified = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"{company_name} - {date_modified}")

        #description
        soup = BeautifulSoup(description_page.text, 'html.parser')
        description = soup.find('section', {'data-testid': 'description'}).find('p').text
        description = description[:250]

        company_data = {
            "Company": company_name,
            "Symbol": company_symbol,
            "Price": price,
            "Change": change,
            "Volume": volume,
            "URL": url,
            "Description": description,
            "Last_Updated": date_modified
        }
        
        all.append(company_data)

    except AttributeError as e:
        print(f"Error occurred while scraping {symbol}: {e}")
        time.sleep(random.uniform(5, 10))  # Sleep longer if there's an error
    except requests.exceptions.RequestException as e:
        print(f"Request failed for {symbol}: {e}")
        time.sleep(random.uniform(5, 10))  # Sleep longer if request fails

# %%
#panda it
column_names = ["Company", "Symbol", "Price", "Change", "Volume", "URL", "Last_Updated" ,"Description" ]
df = pd.DataFrame(all, columns=column_names)
filepath = 'C:\\Fullstack_apps\\stocks-higher-or-lower\\demo\\src\\main\\resources\\python-scripts'
json_file_path = os.path.join(filepath,'stocks.json')

with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(all, json_file, ensure_ascii=False, indent=4)

print("Data scraping completed and saved to 'stocks.json'.")
