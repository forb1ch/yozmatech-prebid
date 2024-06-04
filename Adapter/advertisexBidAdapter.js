// Import necessary modules
import {logInfo} from '../src/utils.js';
import { registerBidder } from '../src/adapters/bidderFactory.js'; // Import function to register bidder
import {BANNER} from '../src/mediaTypes.js';

// Bidder code for AdvertiseX
const BIDDER_CODE = 'advertisex';

// Adapter version
const ADAPTER_VERSION = '1.0';

// Default Bid TTL
const DEFAULT_BID_TTL = 360;

// Default currency
const DEFAULT_CURRENCY = 'USD';

// Request method
const ADVERTISEX_REQUEST_METHOD = 'POST';

// Endpoint URL for fetching bid
const ADVERTISEX_ENDPOINT = 'http://localhost:3000/getAdvertisexBid';

// Parse Bid response object
function parseBid(response, requestData) {
    return {
        requestId: requestData.bidId,
        cpm: response.cpm,
        width: response.width,
        height: response.height,
        creativeId: response.creativeId,
        currency: DEFAULT_CURRENCY,
        netRevenue: true,
        ttl: DEFAULT_BID_TTL,
        ad: response.ad,
        adId: response.bidId,
        bidder: BIDDER_CODE,
    }
}

// Define the spec object containing bidder implementation
const spec = {
    code: BIDDER_CODE,
    version: ADAPTER_VERSION,
    supportedMediaTypes: [BANNER],

    isBidRequestValid: function (bid) {
        // will receive request bid. check if have necessary params for bidding
        return (bid && bid.hasOwnProperty('params') && bid.params.hasOwnProperty('adUnitCode') && bid.hasOwnProperty('bidder'))
    },
    /**
     * Make a server request from the list of BidRequests.
     *
     * @return Array Info describing the request to the server.
     * @param bidRequests
     * @param bidderRequest
    */
    buildRequests: function(bidRequests, bidderRequest) {
        // Map bid requests to request objects
        const requests = bidRequests.map(bid => {
            let url = ADVERTISEX_ENDPOINT;
            const data = {
                adUnitCode: bid.params.adUnitCode,
                sizes: bid.sizes,
                bidId: bid.bidId,
            }

            return {
                method: ADVERTISEX_REQUEST_METHOD,
                url,
                data
            };
        });

        return requests;
    },

    // Function to interpret bid response
    interpretResponse: function(serverResponse, request) {
        const bidResponses = []
        const response = serverResponse.body;

        let requestData = request.data; 

        if (typeof requestData === 'string') {
            requestData = JSON.parse(requestData);
        }

        if (response && response.creativeId == 'advertisex-1') {
            let bidResponse = parseBid(response, requestData);
            bidResponses.push(bidResponse);

        } else {
            logInfo('AvertiseX: no valid responses to interpret')
        }
        return bidResponses;
    }

};

registerBidder(spec);