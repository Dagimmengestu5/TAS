@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="{{ asset('assets/logo.png') }}" class="logo" alt="Droga Group TAS Logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
