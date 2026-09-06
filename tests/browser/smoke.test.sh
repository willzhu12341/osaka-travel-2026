#!/usr/bin/env bash
set -e

URL="http://127.0.0.1:5173/"
myflicker-browser new_tab --url "$URL"
myflicker-browser snapshot --tab-id electron-webview-8
myflicker-browser wait_for --tab-id electron-webview-8 --text "行程总览"
myflicker-browser console_messages --tab-id electron-webview-8 --limit 50
myflicker-browser network_requests --tab-id electron-webview-8 --limit 50
