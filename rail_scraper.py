from bs4 import BeautifulSoup
import urllib

rawHTML = urllib.urlopen('http://www.njtransit.com/sf/sf_servlet.srv?hdnPageAction=LightRailSchedulesPrintTo&selOrigin=6995++++&selDestination=42545&OriginDescription=Warren+St&DestDescription=Newark+Penn+Station&selDay=W&datepicker=09/07/2016&selLineCode=7&LineDescription=Newark+Light+Rail')

html = BeautifulSoup(rawHTML, "html.parser")

times = []

i = 0
j = 4

for td in html.findAll('td'):
	if i > 7:
		if j == 4:
			times.append('\"'+td.text+'\"')
			j = 0
		j += 1
	i += 1

saveFile = open("./data/raw_rail.json", 'a')
saveFile.write(str(times))
saveFile.close()


