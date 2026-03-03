<x-mail::message>
# Database Backup

Hello,

The scheduled monthly database backup for **{{ config('app.name') }}** has been successfully completed.

Please find the attached SQL dump file for your records.

<x-mail::button :url="config('app.url')">
Visit System Hub
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} IT Node
</x-mail::message>
