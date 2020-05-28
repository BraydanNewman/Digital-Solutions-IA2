import time
import requests


url_list = ["https://andie.standrewscc.qld.edu.au/homepage/8087",
            "https://andie.standrewscc.qld.edu.au/homepage/code/12ENGIN11",
            "https://andie.standrewscc.qld.edu.au/homepage/code/12DES",
            "https://andie.standrewscc.qld.edu.au/homepage/3510",
            "https://andie.standrewscc.qld.edu.au/homepage/code/12DIGS"]


def yeet():
    i = 0
    while True:
        for item in url_list:
            i = i + 1
            LOL = requests.get(item)
            time.sleep(2)
            print(str(i) + "    " + str(LOL))


if __name__ == "__main__":
    yeet()
