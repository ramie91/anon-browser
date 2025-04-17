#import "WebViewDataManager.h"
#import <React/RCTLog.h>

@implementation WebViewDataManager

// Export the module to React Native, naming it "WebViewDataManager" in JavaScript
RCT_EXPORT_MODULE();

// Export the 'clearAllWebViewData' method to JavaScript
RCT_EXPORT_METHOD(clearAllWebViewData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"[WebViewDataManager] Attempting to clear all WebView data.");

  // Ensure this runs on the main thread if it interacts with UI components,
  // but WKWebsiteDataStore operations are generally safe for background threads.
  // Using main queue for safety and simplicity here.
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      // Get the default data store (used by WKWebView instances unless configured otherwise)
      WKWebsiteDataStore *dataStore = [WKWebsiteDataStore defaultDataStore];
      // Get all possible types of website data
      NSSet<NSString *> *allDataTypes = [WKWebsiteDataStore allWebsiteDataTypes];

      // Fetch all data records currently stored
      [dataStore fetchDataRecordsOfTypes:allDataTypes completionHandler:^(NSArray<WKWebsiteDataRecord *> *records) {
        if (records.count == 0) {
          RCTLogInfo(@"[WebViewDataManager] No WebView data found to clear.");
          resolve(@YES); // Resolve the promise indicating success (nothing to clear)
          return;
        }

        RCTLogInfo(@"[WebViewDataManager] Found %lu data records to clear.", (unsigned long)records.count);

        // Remove the fetched data records
        [dataStore removeDataOfTypes:allDataTypes forDataRecords:records completionHandler:^{
          RCTLogInfo(@"[WebViewDataManager] Successfully cleared all WebView data.");
          resolve(@YES); // Resolve the promise indicating success
        }];
      }];
    } @catch (NSException *exception) {
      RCTLogError(@"[WebViewDataManager] Exception while clearing WebView data: %@", exception.reason);
      NSError *error = [NSError errorWithDomain:@"WebViewDataManagerError"
                                           code:1
                                       userInfo:@{NSLocalizedDescriptionKey: exception.reason}];
      reject(@"clear_error", exception.reason, error); // Reject the promise on error
    }
  });
}

// Optional: Specify that this module should run on the main thread
// This might be necessary if interacting directly with UI components,
// but for data store operations it's often not strictly required.
// Returning nil uses a background thread. Returning dispatch_get_main_queue() forces main thread.
// - (dispatch_queue_t)methodQueue
// {
//   return dispatch_get_main_queue();
// }

@end
