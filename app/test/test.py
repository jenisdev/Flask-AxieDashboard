import requests
from requests.api import put

url = 'http://18.170.166.198/'
#url = 'http://127.0.0.1:5500/'

usr = "LFGTeam"
passwd = "3Mc(M~:LR+PY7csw"

def get_test(url):
    param = '0x9bc191c07d59478d6d2bfcb5060cae80090427e3'
    response = requests.get(url+param)
    return(response.json())


def put_test(url):
    param = '0xdb3091a67f647cf209514ace00e13d2d4638cc17'
    response = requests.put(

        url+param,

        #authenticate who we are
        auth=requests.auth.HTTPBasicAuth(usr, passwd),

        #data we want to write to the scholar
        data={"ClaimedSLP": 50, "WinRate":"100%"}
    )
    return(response.json())


def post_test(url):
    param = '0xdb3091a67f647cf209514ace00e13d2d4638cc17'
    response = requests.post(
        #link we go to
        url+param,

        #authenticate who we are
        auth=requests.auth.HTTPBasicAuth(usr, passwd),

        #data we want to write to the scholar
        data={
            "Name": "Bekeno",
            "DiscordID":280403145270755338,
            "ManagerShare":50,
            "InvestorTrainerShare":1,
            "ScholarShare":49,
            "PersonalRoninAddress": "0xdb3091a67f647cf209514ace00e13d2d4638cc18"
        }
    )
    return(response.json())


def delete_test(url):
    param = '0xdb3091a67f647cf209514ace00e13d2d4638cc17'
    response = requests.delete(
        #link we go to
        url+param,

        #authenticate who we are
        auth=requests.auth.HTTPBasicAuth(usr, passwd),
    )
    return(response.json())


if __name__ == "__main__":
    #print(get_test(url))
    #print(put_test(url))
    #print(post_test(url))
    print(delete_test(url))

# ------------------------------------------------------------------------------------------------
import mysql.connector
import time, datetime


#Connect to our database
myDb = mysql.connector.connect(
    host="ls-16a5009e4d9680ee447daa82c8ece035b4bedff2.cvasw40kycww.eu-west-2.rds.amazonaws.com",
    user="dbmasteruser",
    password=")+wH{,O3xEU$DHW0fU)AuTwJNipA+0^T",
    database="dbmaster"
)
cursor = myDb.cursor()


#calculates the average of the list
def Average(lst):
    return sum(lst) / len(lst)


#converts tuple lists to normal lists
def Convert(tup, lst):
    for line in tup:
        newLine = [line[0],line[1]]
        lst.append(newLine)
    return lst


#gets the averages based on the two provided dates. Provide dates in the format "dd/mm/yyyy"
def Average_Gained_On_Date(dateTwo):

    #establish a first date which will be the beginning of the previous day
    dateOne = datetime.datetime.strptime(dateTwo, "%d/%m/%Y")
    dateOne = dateOne - datetime.timedelta(days=1)
    dateOne = dateOne.strftime("%d/%m/%Y")

    #establish a third date which will be the end of the second date
    dateThree = datetime.datetime.strptime(dateTwo, "%d/%m/%Y")
    dateThree = dateThree + datetime.timedelta(days=1)
    dateThree = dateThree.strftime("%d/%m/%Y")

    #convert to timestamps
    dateOne = int(time.mktime(datetime.datetime.strptime(dateOne, "%d/%m/%Y").timetuple()))
    dateTwo = int(time.mktime(datetime.datetime.strptime(dateTwo, "%d/%m/%Y").timetuple()))
    dateThree = int(time.mktime(datetime.datetime.strptime(dateThree, "%d/%m/%Y").timetuple()))

    #get list of todays values
    statement = "SELECT RoninAddress, SLP FROM scholar_daily_totals WHERE Date BETWEEN %s and %s"
    values = (dateTwo,dateThree)
    cursor.execute(statement, values)
    todaysValuesRaw = cursor.fetchall()
    
    #get list of yesterdays values
    statement = "SELECT RoninAddress, SLP FROM scholar_daily_totals WHERE Date BETWEEN %s and %s"
    values = (dateOne,dateTwo)
    cursor.execute(statement, values)
    yesterdaysValuesRaw = cursor.fetchall()

    #convert tuple lists to normal lists
    todaysValues = []
    yesterdaysValues = []
    Convert(todaysValuesRaw, todaysValues)
    Convert(yesterdaysValuesRaw, yesterdaysValues)

    #assemble everyones data together in 1 line per person
    for line in todaysValues:
        for item in yesterdaysValues:
            if line[0] == item[0]:
                line.append(item[1])
    allValues = todaysValues

    #calculate all differences and assemble into a list
    differences = []
    for line in allValues:
        try:
            differences.append(line[1]-line[2])
        except:
            differences.append(0)

    return(round(Average(differences),2))



if __name__ == "__main__":

    #get today and yesterday as datetime obj
    today = datetime.date.today()
    yesterday = today - datetime.timedelta(days=1)
    threeday = today - datetime.timedelta(days=2)

    #convert to strings
    today = today.strftime("%d/%m/%Y")
    yesterday = yesterday.strftime("%d/%m/%Y")
    threeday = threeday.strftime("%d/%m/%Y")

    print(Average_Gained_On_Date(today))
    print(Average_Gained_On_Date(yesterday))
    print(Average_Gained_On_Date(threeday))