using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTrainingPlan.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 3, 8, 14, 47, 0, 42, DateTimeKind.Utc).AddTicks(2862), new DateTime(2026, 3, 8, 14, 47, 0, 42, DateTimeKind.Utc).AddTicks(3539) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 3, 8, 14, 37, 39, 581, DateTimeKind.Utc).AddTicks(5962), new DateTime(2026, 3, 8, 14, 37, 39, 581, DateTimeKind.Utc).AddTicks(6409) });
        }
    }
}
