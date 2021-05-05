from nsetools import Nse


def fetch_data(ticker):
    nse = Nse()

    return nse.get_quote(ticker, as_json = True)

def fetch_gainers():
    nse = Nse()
    return nse.get_top_gainers(as_json = True)

def fetch_losers():
    nse = Nse()
    return nse.get_top_losers(as_json = True)