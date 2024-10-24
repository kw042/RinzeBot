# src/features/scraping/scraper.py スクレイピングのための関数を定義
import os
import json
import time
from datetime import datetime
import re

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

#seleniumによるHTMLデータの取得
def download_html(url, filepath):
    options = Options()
    options.add_argument('--headless') #ヘッドレスモード(画面を表示なし)
    options.add_argument('--no-sandbox') #これ代替を探したほうがいいらしい
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    print("HTMLファイルのダウンロードを開始")
    driver.get(url)

    #ページ読み込みの待機
    time.sleep(3)

    #取得したHTMLデータをファイルに保存
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(driver.page_source)
    print("HTMLファイルのダウンロードを終了")
    driver.quit() #終了

#BeautifulSoupによるHTMLデータの解析
def get_items(filepath):
    # 保存したHTMLファイルを読み取る
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')

    titles = soup.find_all("h2", class_="reception-info-title") #ライブタイトルの取得
    forms = soup.find_all("p", class_="reception-info-description") #申し込み方式の取得
    contents = soup.find_all("div", class_="content") #期間をとりたいがそれ以外も取れる

    terms = [] #申し込み期間を格納
    # termsからtextクラスのdiv要素を取り除く
    for content in contents:
        for div in content.find_all("p", class_="description"):
            div.extract()
        if content.text != "":
            terms.append(content) #termsに追加

    data = [] #json書き込み用のリスト
    for i in range(min(len(titles), len(forms), len(terms))):
        start, end = parse_term(terms[i].text) #期間を分割
        state = "active" if is_active_event(start, end) else "inactive" #申し込み期間が有効かどうか

        data.append({
            "title": titles[i].text,
            "form": forms[i].text,
            "start": start,
            "end": end,
            "state": state
        })   

    return data
    
#申し込み開始日と終了日に分割
def parse_term(term):
    # 2024年10月5日(土) 12:00 〜 2024年10月15日(火) 17:00のような形式で与えられる
    pattern = r"(\d{4}年\d{1,2}月\d{1,2}日\(.{1,3}\)\s\d{1,2}:\d{2})\s〜\s(\d{4}年\d{1,2}月\d{1,2}日\(.{1,3}\)\s\d{1,2}:\d{2})"
    match = re.search(pattern, term)

    if match:
        start_str, end_str = match.groups()

        # 日本語の曜日部分 "(日)" や "(月)" を取り除くための正規表現
        start_str = re.sub(r'\(.{1,3}\)', '', start_str)
        end_str = re.sub(r'\(.{1,3}\)', '', end_str)

        # datetimeオブジェクトに変換
        start_dt = datetime.strptime(start_str, "%Y年%m月%d日 %H:%M")
        end_dt = datetime.strptime(end_str, "%Y年%m月%d日 %H:%M")

        # 指定された形式に変換
        start_formatted = start_dt.strftime("%Y-%m-%d-%H%M")
        end_formatted = end_dt.strftime("%Y-%m-%d-%H%M")

        return start_formatted, end_formatted
    else:
        return None, None

# 今日が申込期間内かを判定
def is_active_event(start_str, end_str):
    # 日付文字列を datetime オブジェクトに変換
    start_dt = datetime.strptime(start_str, "%Y-%m-%d-%H%M")
    end_dt = datetime.strptime(end_str, "%Y-%m-%d-%H%M")
    now = datetime.now()

    # 現在が申込期間内かを判定
    return start_dt <= now and now<= end_dt

def save_to_json(data, filepath):
    data = {
        "reminders": data,
    }

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print("JSONファイルの保存が完了")

def scrape(url, html_filepath, json_filepath):
    try:
        # すでにHTMLファイルが存在する場合はスキップ
        if not os.path.exists(html_filepath):
            download_html(url, html_filepath)

        #download_html(url, html_filepath)
        data = get_items(html_filepath)
        save_to_json(data, json_filepath)

    except Exception as e:
        print(f"スクレイピングに失敗: {e}")

if __name__ == "__main__":
    url = "https://asobiticket2.asobistore.jp/receptions"
    html_filepath = "src\data\page_content.html"
    json_filepath = "src\data\events.json"

    scrape(url, html_filepath, json_filepath)