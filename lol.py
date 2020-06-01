import time
import webbrowser
from time import sleep

from selenium import webdriver

url = 'https://andie.standrewscc.qld.edu.au/homepage/code/12DIGS'

driver = webdriver.Chrome("D:/Downloads/chromedriver_win32/chromedriver.exe")
driver.get(url)

count = 0

while True:
    count += 1
    print(count)
    driver.refresh()
    time.sleep(1)