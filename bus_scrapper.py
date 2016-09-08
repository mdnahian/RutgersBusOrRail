
times = []



with open("./data/raw_bus.txt") as f:
    content = f.readlines()
    for b in content:
    	times.append(b)



saveFile = open("./data/raw_bus_2.json", 'a')
saveFile.write(str(times))
saveFile.close()