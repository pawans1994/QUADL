




for i in range(900,1800,100):
    print('conversePolicy'+ str(int(i/100)) +'.txt','w')

    for j in range(0,100,50):
        with open('conversePolicy'+ str(int((i+j)/50)) +'.sh','w') as f:
            dir = str(i) + '_' + str(i+99)
            print(dir)
            for_s = 'for i in {' + str(i+j) + '..' +str(i+j+49) + '}\n'+'do\n'+"python conversePolicy.py ../data/" + dir + "/forvalueItr_RafineSim3_$i.csv ./" + dir + "/policy_RafineSim3_$i.csv ./"+ dir + "/utility_RafineSim3_$i.csv\n" +'done'
            f.write(for_s)
