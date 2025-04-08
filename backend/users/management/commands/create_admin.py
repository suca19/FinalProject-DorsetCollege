from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates or updates an admin user'

    def handle(self, *args, **options):
        admin_email = 'admin@gmail.com'
        admin_password = 'Admin123!'
        
        # Check if user exists by username
        try:
            user = User.objects.get(username='admin')
            self.stdout.write(self.style.WARNING(f"Admin user already exists. Updating..."))
            
            # Update user fields
            user.email = admin_email
            user.set_password(admin_password)
            user.first_name = 'Admin'
            user.last_name = 'User'
            
        except User.DoesNotExist:
            self.stdout.write(self.style.SUCCESS(f"Creating new admin user..."))
            # Create a new user with a different username
            user = User.objects.create_user(
                username='admin_user',  # Different username
                email=admin_email,
                password=admin_password,
                first_name='Admin',
                last_name='User'
            )
        
        # Set admin properties
        user.role = 'admin'
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        self.stdout.write(self.style.SUCCESS(f"\nAdmin user ready:"))
        self.stdout.write(f"  Email: {user.email}")
        self.stdout.write(f"  Username: {user.username}")
        self.stdout.write(f"  Password: {admin_password}")
        self.stdout.write(f"  Role: {getattr(user, 'role', 'N/A')}")
        self.stdout.write(f"  is_staff: {user.is_staff}")
        self.stdout.write(f"  is_superuser: {user.is_superuser}")
        
        # List all users
        self.stdout.write("\nAll users in database:")
        for u in User.objects.all():
            self.stdout.write(f"- {u.username} ({u.email}): role={getattr(u, 'role', 'N/A')}, is_staff={u.is_staff}")