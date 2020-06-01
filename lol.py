import time
from selenium import webdriver

url = 'https://andie.standrewscc.qld.edu.au/homepage/8087'

driver = webdriver.Chrome("chromedriver.exe")
driver.get(url)

count = 0

input()

while True:
    count += 1
    print(count)
    driver.refresh()
    time.sleep(1)
