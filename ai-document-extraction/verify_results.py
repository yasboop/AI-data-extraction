#!/usr/bin/env python3

import json
import os

def print_results():
    try:
        with open('api_test_result.json', 'r') as f:
            data = json.load(f)
        
        # Check if summary exists
        has_summary = 'summary' in data
        summary_length = len(data.get('summary', ''))
        
        print(f"EXTRACTION RESULTS:")
        print(f"===================")
        print(f"Summary exists: {has_summary}")
        print(f"Summary length: {summary_length} characters")
        print()
        
        # Print key fields
        print(f"Contract Number: {data.get('contract_number')}")
        print(f"Client: {data.get('client_name')}")
        print(f"Service Provider: {data.get('service_provider')}")
        print(f"Start Date: {data.get('start_date')}")
        print(f"End Date: {data.get('end_date')}")
        print()
        
        # Print first 200 chars of summary
        if has_summary:
            print("Summary Preview:")
            print("----------------")
            print(data['summary'][:200] + "...")
            print()
        
        print("REGEX AUGMENTATION CHECK:")
        print("=========================")
        # Check if any fields were augmented with regex
        has_regex_data = False
        if data.get('payment_terms', {}).get('amount') is not None:
            has_regex_data = True
            print("Payment terms augmented with regex")
            
        if 'signing_date' in data.get('signatures', {}):
            has_regex_data = True
            print("Signature date augmented with regex")
            
        if not has_regex_data:
            print("No obvious regex augmentation detected")
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    if os.path.exists('api_test_result.json'):
        print_results()
    else:
        print("No test results file found. Run test_api.py first.") 