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
