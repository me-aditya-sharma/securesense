import sys, json, os
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))
from services.nlp_engine import analyze_communication

text = """Subject: Update regarding your Apex Streaming Premium Subscription

Dear Valued Customer,

Thank you for being a loyal member of Apex Streaming. We are writing to inform you that your promotional 12-month period has ended.

As per our digital terms of service, your account has been automatically upgraded to our Platinum Tier at the standard rate of $89.99/month. Please note that a mandatory $15.00 \"Infrastructure Maintenance Fee\" and a $10.00 \"Administrative Processing Fee\" have been added to your current billing cycle. These fees are non-refundable and were approved upon your initial sign-up.

If you wish to cancel your subscription, you must submit a written request via physical mail to our corporate headquarters at least 60 days prior to your next billing cycle. Cancellations are not permitted via email, phone, or our website. Failure to provide a 60-day physical notice will result in an automatic renewal for an additional 12-month commitment, and a $200 early termination fee will be charged to your card on file.

Best regards,
Apex Streaming Support Team"""
result = analyze_communication(text)
print(json.dumps(result, indent=2))
