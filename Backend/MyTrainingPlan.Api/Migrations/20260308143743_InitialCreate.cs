using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTrainingPlan.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    GlobalRestVideoUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Stages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    StageName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    YoutubeUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    PracticeSeconds = table.Column<int>(type: "INTEGER", nullable: false),
                    RestSeconds = table.Column<int>(type: "INTEGER", nullable: false),
                    StartSecond = table.Column<int>(type: "INTEGER", nullable: false),
                    EndSecond = table.Column<int>(type: "INTEGER", nullable: true),
                    OrderIdx = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stages_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "CreatedAt", "GlobalRestVideoUrl", "Name", "UpdatedAt" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000001"), new DateTime(2026, 3, 8, 14, 37, 39, 581, DateTimeKind.Utc).AddTicks(5962), "", "預設專案", new DateTime(2026, 3, 8, 14, 37, 39, 581, DateTimeKind.Utc).AddTicks(6409) });

            migrationBuilder.CreateIndex(
                name: "IX_Stages_ProjectId",
                table: "Stages",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stages");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
