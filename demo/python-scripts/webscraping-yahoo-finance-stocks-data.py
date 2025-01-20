# %%
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

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

        #description
        soup = BeautifulSoup(description_page.text, 'html.parser')
        description = soup.find('section', {'data-testid': 'description'}).find('p').text
        description = description[:250]

        x=[company_name,company_symbol,price,change,volume,url, description]
        all.append(x)

    except AttributeError as e:
        print(f"Error occurred while scraping {symbol}: {e}")
        time.sleep(random.uniform(5, 10))  # Sleep longer if there's an error
    except requests.exceptions.RequestException as e:
        print(f"Request failed for {symbol}: {e}")
        time.sleep(random.uniform(5, 10))  # Sleep longer if request fails

# %%
#panda it
column_names = ["Company", "Symbol", "Price", "Change", "Volume", "URL", "Description"]
df = pd.DataFrame(all, columns=column_names)
df.to_csv('demo\\python-scripts\\stocks.CSV')

print("Data scraping completed and saved to 'stocks.csv'.")

