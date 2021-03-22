using DTS3YRProject.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DTS3YRProject.Hubs
{
    public class SignalRHub : Hub
    {
        public async Task OnJoined(string userName)
        {
            var userInfo = new UserInfo() { userName = userName, connectionId = Context.ConnectionId };
            await Clients.Others.SendAsync("UserJoined", JsonSerializer.Serialize(userInfo));
        }

        public async Task SendNotification(string userName, string user)
        {
            var userInfo = new UserInfo() { userName = userName, connectionId = Context.ConnectionId };
            await Clients.Client(user).SendAsync("SendNotification", JsonSerializer.Serialize(userInfo));
        }

        public async Task SendSignal(string signal, string user)
        {
            await Clients.Client(user).SendAsync("SendSignal", Context.ConnectionId, signal);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
