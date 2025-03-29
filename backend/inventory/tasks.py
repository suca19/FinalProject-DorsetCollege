import logging
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Product
from users.models import User

logger = logging.getLogger('inventory')

@shared_task
def check_low_stock_levels():
    """
    Check for products with low stock levels and send notifications.
    """
    low_stock_products = Product.objects.filter(stock_quantity__lte=models.F('low_stock_threshold'))
    
    if not low_stock_products.exists():
        logger.info("No products with low stock found.")
        return "No products with low stock found."
    
    # Get managers and admins for notification
    recipients = User.objects.filter(role__in=['admin', 'manager'], is_active=True)
    
    if not recipients.exists():
        logger.warning("No active managers or admins found to notify about low stock.")
        return "No recipients found for low stock notification."
    
    # Prepare email content
    subject = "Low Stock Alert"
    message = "The following products are low in stock:\n\n"
    
    for product in low_stock_products:
        message += f"- {product.name}: {product.stock_quantity} remaining (threshold: {product.low_stock_threshold})\n"
    
    message += "\nPlease restock these items as soon as possible."
    
    # Send email to each recipient
    recipient_emails = [user.email for user in recipients]
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_emails,
            fail_silently=False,
        )
        logger.info(f"Low stock notification sent to {len(recipient_emails)} recipients.")
        return f"Low stock notification sent for {low_stock_products.count()} products."
    except Exception as e:
        logger.error(f"Failed to send low stock notification: {str(e)}")
        return f"Error sending low stock notification: {str(e)}"

@shared_task
def generate_inventory_report():
    """
    Generate inventory report and send to admins.
    """
    # Implementation for generating inventory reports
    pass

