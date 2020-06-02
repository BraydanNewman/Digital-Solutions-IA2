import time
from selenium import webdriver
import requests

url = 'https://andie.standrewscc.qld.edu.au/homepage/code/12ENGIN11'

driver = webdriver.Chrome("chromedriver.exe")
driver.get(url)

count = 0

input()

while True:
    count += 1
    r = requests.get(url)
    print(str(count) + " : " + str(r.status_code))
    driver.refresh()
    time.sleep(1)
